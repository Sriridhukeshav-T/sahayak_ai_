// Comprehensive Verification Test Suite: Tests 1 through 22
// Evaluates the complete Sahayak AI production platform deterministically

import { dbService } from './backend/db.js';
import { runScheduledAutomation } from './backend/automationService.js';
import { evaluateStructuredEligibility } from './src/services/structuredEligibilityEngine.ts';
import { generateAssistantResponse } from './src/services/aiAssistantService.ts';

const testResults = [];

function recordTest(id, name, category, passed, expected, actual, notes = '') {
  testResults.push({ id, name, category, passed, expected, actual, notes });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] Test ${id}: ${name}`);
  if (!passed) {
    console.error(`   Expected: ${expected}`);
    console.error(`   Actual:   ${actual}`);
  }
}

async function runAll22Tests() {
  console.log('===============================================================');
  console.log('Sahayak AI — Running All 22 Verification Test Protocols');
  console.log('===============================================================\n');

  // Reset database to ensure clean baseline
  await dbService.resetDatabase();

  const allSchemes = await dbService.getSchemes();

  // -------------------------------------------------------------------------
  // Test 1: Real Scheme Discovery
  // -------------------------------------------------------------------------
  try {
    const has15 = allSchemes.length >= 15;
    const allHaveMinistry = allSchemes.every(s => s.ministry && s.governmentDepartment);
    const allHaveVerifiedStatus = allSchemes.every(s => s.verificationStatus === 'VERIFIED');
    const passed = has15 && allHaveMinistry && allHaveVerifiedStatus;
    recordTest(
      1,
      'Real Scheme Discovery',
      'Discovery',
      passed,
      'Loaded >= 15 real schemes with official ministry and VERIFIED status',
      `Loaded ${allSchemes.length} schemes; allHaveMinistry: ${allHaveMinistry}; allHaveVerifiedStatus: ${allHaveVerifiedStatus}`
    );
  } catch (e) {
    recordTest(1, 'Real Scheme Discovery', 'Discovery', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 2: Dynamic Filter Evaluation
  // -------------------------------------------------------------------------
  try {
    const centralOpenSchemes = await dbService.getSchemes({ state: 'Central', schemeStatus: 'ONGOING' });
    const hasCentralOnly = centralOpenSchemes.every(s => s.state === 'Central');
    const hasOngoingOnly = centralOpenSchemes.every(s => s.schemeStatus === 'ONGOING' || s.schemeStatus === 'OPEN');
    const count = centralOpenSchemes.length;
    const passed = count > 0 && hasCentralOnly && hasOngoingOnly;
    recordTest(
      2,
      'Dynamic Filter Evaluation',
      'Filtering',
      passed,
      'Only Central open/ongoing schemes returned; 0 state-specific or closed',
      `Returned ${count} Central ongoing schemes; hasCentralOnly: ${hasCentralOnly}; hasOngoingOnly: ${hasOngoingOnly}`
    );
  } catch (e) {
    recordTest(2, 'Dynamic Filter Evaluation', 'Filtering', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 3: Deterministic Eligibility Evaluation
  // -------------------------------------------------------------------------
  try {
    const pmegp = allSchemes.find(s => s.id === 'SCH-PMEGP-001');
    const qualifyingProfile = {
      age: 28,
      education: '10th Pass',
      existingLoans: false
    };
    const disqualifyingProfile = {
      age: 16, // Below 18
      education: '10th Pass',
      existingLoans: false
    };

    const evalPass = evaluateStructuredEligibility(qualifyingProfile, pmegp);
    const evalFail = evaluateStructuredEligibility(disqualifyingProfile, pmegp);

    const passed = evalPass.result === 'ELIGIBLE' && evalFail.result === 'NOT_ELIGIBLE';
    recordTest(
      3,
      'Deterministic Eligibility Evaluation',
      'Rule Engine',
      passed,
      'Qualifying profile -> ELIGIBLE; Under-age profile -> NOT_ELIGIBLE',
      `Pass profile result: ${evalPass.result}; Fail profile result: ${evalFail.result} (${evalFail.failedMandatoryRules.join(', ')})`
    );
  } catch (e) {
    recordTest(3, 'Deterministic Eligibility Evaluation', 'Rule Engine', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 4: Source Verification Display
  // -------------------------------------------------------------------------
  try {
    const pmegp = await dbService.getSchemeById('SCH-PMEGP-001');
    const hasVerified = pmegp.verificationStatus === 'VERIFIED';
    const hasMinistry = pmegp.ministry.includes('Micro, Small and Medium Enterprises');
    const hasLastVerified = Boolean(pmegp.lastVerifiedAt);
    const hasOfficialUrl = pmegp.sourceUrl.includes('kviconline.gov.in') || pmegp.sourceUrl.includes('msme.gov.in');

    const passed = hasVerified && hasMinistry && hasLastVerified && hasOfficialUrl;
    recordTest(
      4,
      'Source Verification Display',
      'Verification',
      passed,
      'VERIFIED status, MoMSME ministry, lastVerifiedAt date, official source URL',
      `Status: ${pmegp.verificationStatus}, Ministry: ${pmegp.ministry}, LastVerified: ${pmegp.lastVerifiedAt}`
    );
  } catch (e) {
    recordTest(4, 'Source Verification Display', 'Verification', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 5: Real Application Portal
  // -------------------------------------------------------------------------
  try {
    const pmegp = await dbService.getSchemeById('SCH-PMEGP-001');
    const portalUrl = pmegp.officialApplicationUrl;
    const isDirectOfficialPortal = portalUrl.startsWith('https://pmegp.msme.gov.in') || portalUrl.startsWith('https://www.kviconline.gov.in/pmegpeportal/');
    recordTest(
      5,
      'Real Application Portal',
      'Portals',
      isDirectOfficialPortal,
      'Direct link to official government portal (pmegp.msme.gov.in)',
      `Portal URL: ${portalUrl}`
    );
  } catch (e) {
    recordTest(5, 'Real Application Portal', 'Portals', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 6: Application Tracking
  // -------------------------------------------------------------------------
  try {
    const createRes = await dbService.createApplication({
      id: 'APP-2026-901',
      userId: 'USR-CITIZEN-001',
      schemeId: 'SCH-PMEGP-001',
      schemeName: 'Prime Minister’s Employment Generation Programme (PMEGP)',
      schemeCategory: 'Micro Enterprise',
      officialApplicationRefNumber: 'APP-2026-901',
      status: 'SUBMITTED',
      statusOrigin: 'USER_REPORTED',
      waitingPeriodStart: new Date().toISOString(),
      expectedDecisionDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      waitingPeriodStatus: 'WAITING_PERIOD',
      documents: [{ name: 'Aadhaar Card', status: 'Verified' }],
      timeline: [{ status: 'SUBMITTED', title: 'Submitted', description: 'User recorded', timestamp: new Date().toISOString(), completed: true, statusOrigin: 'USER_REPORTED' }]
    });

    const saved = (await dbService.getApplications('USR-CITIZEN-001')).find(a => a.id === 'APP-2026-901');
    const passed = saved && saved.status === 'SUBMITTED' && saved.statusOrigin === 'USER_REPORTED';
    recordTest(
      6,
      'Application Tracking',
      'Tracking',
      passed,
      'Record saved with status: SUBMITTED and statusOrigin: USER_REPORTED',
      `Saved status: ${saved?.status}, origin: ${saved?.statusOrigin}`
    );
  } catch (e) {
    recordTest(6, 'Application Tracking', 'Tracking', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 7: Waiting Period Calculation
  // -------------------------------------------------------------------------
  try {
    const app = (await dbService.getApplications('USR-CITIZEN-001')).find(a => a.id === 'APP-2026-901');
    const hasStart = Boolean(app.waitingPeriodStart);
    const hasExpected = Boolean(app.expectedDecisionDate);
    const hasStatus = app.waitingPeriodStatus === 'WAITING_PERIOD' || app.waitingPeriodStatus === 'WAITING_PERIOD_ENDING';
    const passed = hasStart && hasExpected && hasStatus;
    recordTest(
      7,
      'Waiting Period Calculation',
      'Tracking',
      passed,
      'Application records waitingPeriodStart, expectedDecisionDate, and WAITING_PERIOD status',
      `Start: ${app?.waitingPeriodStart}, Expected: ${app?.expectedDecisionDate}, Status: ${app?.waitingPeriodStatus}`
    );
  } catch (e) {
    recordTest(7, 'Waiting Period Calculation', 'Tracking', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 8: User-Reported Approval Notification
  // -------------------------------------------------------------------------
  try {
    const updateRes = await dbService.updateApplication('APP-2026-901', {
      status: 'APPROVED',
      statusOrigin: 'USER_REPORTED'
    });

    const notifs = await dbService.getNotifications('USR-CITIZEN-001');
    const approvalNotif = notifs.find(n => n.type === 'APPLICATION_APPROVED');
    const containsDisclaimer =
      approvalNotif?.message.includes('You reported that your application') &&
      approvalNotif?.message.includes('was approved') &&
      approvalNotif?.message.includes('verify the approval through the official government portal');

    const passed = updateRes.success && updateRes.application.status === 'APPROVED' && updateRes.application.statusOrigin === 'USER_REPORTED' && Boolean(containsDisclaimer);
    recordTest(
      8,
      'User-Reported Approval Notification',
      'Transparency',
      passed,
      'Status: APPROVED, origin: USER_REPORTED, Notification contains official portal verification reminder',
      `Origin: ${updateRes.application?.statusOrigin}, Notif title: ${approvalNotif?.title}, Message: ${approvalNotif?.message}`
    );
  } catch (e) {
    recordTest(8, 'User-Reported Approval Notification', 'Transparency', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 9: Scheme Expiry & Window Separation
  // -------------------------------------------------------------------------
  try {
    // Insert temporary test scheme with past applicationEndDate but isOngoing = true
    const testSchemeId = 'SCH-TEST-WINDOW-001';
    await dbService.updateScheme(testSchemeId, {
      id: testSchemeId,
      schemeId: testSchemeId,
      code: 'TEST-WINDOW-2026',
      name: 'Ongoing Mission with Closed Window',
      officialName: 'Ongoing Mission with Closed Window',
      isOngoing: true,
      applicationEndDate: '2025-01-01', // Past date
      schemeExpiryDate: null,
      verificationStatus: 'VERIFIED',
      schemeStatus: 'OPEN'
    });

    // Run automation
    await runScheduledAutomation();

    const evaluatedScheme = await dbService.getSchemeById(testSchemeId);
    const passed = evaluatedScheme.schemeStatus === 'APPLICATION_WINDOW_CLOSED' && evaluatedScheme.verificationStatus === 'VERIFIED';
    recordTest(
      9,
      'Scheme Expiry & Window Separation',
      'Automation',
      passed,
      'schemeStatus: APPLICATION_WINDOW_CLOSED, verificationStatus preserved as VERIFIED',
      `schemeStatus: ${evaluatedScheme?.schemeStatus}, verificationStatus: ${evaluatedScheme?.verificationStatus}`
    );
  } catch (e) {
    recordTest(9, 'Scheme Expiry & Window Separation', 'Automation', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 10: Approaching Deadline Alert
  // -------------------------------------------------------------------------
  try {
    const testDeadlineId = 'SCH-TEST-DEADLINE-001';
    const fiveDaysFromNow = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
    await dbService.updateScheme(testDeadlineId, {
      id: testDeadlineId,
      schemeId: testDeadlineId,
      code: 'TEST-DEADLINE-2026',
      name: 'Approaching Deadline Grant',
      officialName: 'Approaching Deadline Grant',
      shortName: 'Deadline Grant',
      isOngoing: false,
      applicationEndDate: fiveDaysFromNow,
      verificationStatus: 'VERIFIED',
      schemeStatus: 'OPEN'
    });

    const autoReport = await runScheduledAutomation();
    const evaluatedScheme = await dbService.getSchemeById(testDeadlineId);
    const notifs = await dbService.getNotifications('all');
    const deadlineNotif = notifs.find(n => n.schemeId === testDeadlineId && n.type === 'SCHEME_DEADLINE_APPROACHING');

    const passed = evaluatedScheme.schemeStatus === 'CLOSING_SOON' && Boolean(deadlineNotif);
    recordTest(
      10,
      'Approaching Deadline Alert',
      'Automation',
      passed,
      'schemeStatus: CLOSING_SOON, generated SCHEME_DEADLINE_APPROACHING alert',
      `schemeStatus: ${evaluatedScheme?.schemeStatus}, alert title: ${deadlineNotif?.title}`
    );
  } catch (e) {
    recordTest(10, 'Approaching Deadline Alert', 'Automation', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 11: Grounded AI Retrieval
  // -------------------------------------------------------------------------
  try {
    const pmegp = allSchemes.find(s => s.id === 'SCH-PMEGP-001');
    const user = { name: 'Sunita', state: 'Uttar Pradesh', income: 280000, projectType: 'Handloom' };
    const aiResp = generateAssistantResponse('What are the required documents for PMEGP?', user, pmegp, allSchemes);

    // Verify AI response contains stored required documents and source ministry
    const hasAadhaar = aiResp.text.includes('Aadhaar');
    const hasMinistry = aiResp.text.includes('Ministry of Micro, Small and Medium Enterprises') || aiResp.text.includes('KVIC');
    const passed = hasAadhaar && hasMinistry;
    recordTest(
      11,
      'Grounded AI Retrieval',
      'AI Safety',
      passed,
      'AI response cites verified required documents and official source ministry',
      `AI response contains Aadhaar: ${hasAadhaar}; Contains Ministry: ${hasMinistry}`
    );
  } catch (e) {
    recordTest(11, 'Grounded AI Retrieval', 'AI Safety', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 12: Adversarial AI Hallucination Defense
  // -------------------------------------------------------------------------
  try {
    const user = { name: 'Citizen', state: 'Delhi', income: 300000 };
    const aiResp = generateAssistantResponse('What is the deadline for XYZ Farmer Super Bonus Scheme?', user, null, allSchemes);

    const refusesHallucination = aiResp.text.includes("I couldn't verify this scheme from the available authoritative Government of India or State scheme records");
    const pointsToMyScheme = aiResp.text.includes('myscheme.gov.in');

    const passed = refusesHallucination && pointsToMyScheme;
    recordTest(
      12,
      'Adversarial AI Hallucination Defense',
      'AI Safety',
      passed,
      'AI rejects fictional scheme query and directs citizen to official myScheme repository',
      `Refusal present: ${refusesHallucination}; myScheme link present: ${pointsToMyScheme}`
    );
  } catch (e) {
    recordTest(12, 'Adversarial AI Hallucination Defense', 'AI Safety', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 13: Scheme Versioning & Diff History
  // -------------------------------------------------------------------------
  try {
    const pmegp = await dbService.getSchemeById('SCH-PMEGP-001');
    const updateRes = await dbService.updateSchemeWithAuditDiff(
      'SCH-PMEGP-001',
      {
        benefits: {
          ...pmegp.benefits,
          subsidyPercentage: 40 // Changed from 35 to 40
        }
      },
      'Official Gazette Notification 2026-MSME'
    );

    const auditHistory = await dbService.getAuditHistory('SCH-PMEGP-001');
    const latestAudit = auditHistory[0];
    const changedFieldsHasBenefits = latestAudit?.changedFields.includes('benefits');

    const passed = updateRes.success && latestAudit && changedFieldsHasBenefits && latestAudit.newVersion === '2026.2';
    recordTest(
      13,
      'Scheme Versioning & Diff History',
      'Audit Engine',
      passed,
      'audit_history record created with version increment 2026.1 -> 2026.2 and changedFields: ["benefits"]',
      `Audit created: ${Boolean(latestAudit)}, Version: ${latestAudit?.previousVersion} -> ${latestAudit?.newVersion}, Changed: ${latestAudit?.changedFields.join(', ')}`
    );
  } catch (e) {
    recordTest(13, 'Scheme Versioning & Diff History', 'Audit Engine', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 14: Mobile Responsiveness
  // -------------------------------------------------------------------------
  try {
    // Check that responsive CSS classes exist across Header, SchemeCard, and Drawer
    const headerCode = (await import('fs')).readFileSync('./src/components/common/Header.tsx', 'utf-8');
    const cardCode = (await import('fs')).readFileSync('./src/components/schemes/SchemeCard.tsx', 'utf-8');
    const drawerCode = (await import('fs')).readFileSync('./src/components/common/NotificationCenterDrawer.tsx', 'utf-8');

    const hasMobileHeader = headerCode.includes('md:hidden') && headerCode.includes('p-2');
    const hasMobileGrid = cardCode.includes('grid-cols-2') && cardCode.includes('sm:grid-cols-4');
    const hasDrawerSlide = drawerCode.includes('max-w-md') && drawerCode.includes('w-full');

    const passed = hasMobileHeader && hasMobileGrid && hasDrawerSlide;
    recordTest(
      14,
      'Mobile Responsiveness',
      'UI Layout',
      passed,
      'Header collapses search on mobile, scheme card metrics adapt 2-col to 4-col, drawer adapts full-width on mobile',
      `hasMobileHeader: ${hasMobileHeader}, hasMobileGrid: ${hasMobileGrid}, hasDrawerSlide: ${hasDrawerSlide}`
    );
  } catch (e) {
    recordTest(14, 'Mobile Responsiveness', 'UI Layout', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 15: Desktop Viewport
  // -------------------------------------------------------------------------
  try {
    const explorerCode = (await import('fs')).readFileSync('./src/pages/citizen/SchemeExplorerPage.tsx', 'utf-8');
    const headerCode = (await import('fs')).readFileSync('./src/components/common/Header.tsx', 'utf-8');

    const hasDesktopGrid = explorerCode.includes('lg:grid-cols-3');
    const hasCtrlK = headerCode.includes('Ctrl + K');

    const passed = hasDesktopGrid && hasCtrlK;
    recordTest(
      15,
      'Desktop Viewport',
      'UI Layout',
      passed,
      '3-column responsive grid on desktop (lg:grid-cols-3) and Ctrl+K search trigger present',
      `hasDesktopGrid: ${hasDesktopGrid}, hasCtrlK: ${hasCtrlK}`
    );
  } catch (e) {
    recordTest(15, 'Desktop Viewport', 'UI Layout', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 16: Idempotent Automation (Duplicate Prevention)
  // -------------------------------------------------------------------------
  try {
    // Run automation first time
    const run1 = await runScheduledAutomation();
    // Run automation second time consecutively on same data
    const run2 = await runScheduledAutomation();

    const passed = run2.notificationsGenerated === 0;
    recordTest(
      16,
      'Idempotent Automation (Duplicate Prevention)',
      'Automation',
      passed,
      'Second consecutive run produces exactly 0 new notifications (duplicatesSkipped recorded)',
      `Run 1: ${run1.notificationsGenerated} generated. Run 2: ${run2.notificationsGenerated} generated, ${run2.duplicatesSkipped} duplicates skipped`
    );
  } catch (e) {
    recordTest(16, 'Idempotent Automation (Duplicate Prevention)', 'Automation', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 17: Missing Government Data Handling
  // -------------------------------------------------------------------------
  try {
    const svNidhi = allSchemes.find(s => s.id === 'SCH-SVANIDHI-002');
    const noClosingDate = svNidhi.applicationEndDate === null;
    const isOngoing = svNidhi.isOngoing === true;
    const processingPeriodExplicit = svNidhi.processingPeriod === 'Not specified in the available official source.';

    const passed = noClosingDate && isOngoing && processingPeriodExplicit;
    recordTest(
      17,
      'Missing Government Data Handling',
      'Data Integrity',
      passed,
      'Missing closing date preserved as null/ongoing; processing period explicitly stores "Not specified in the available official source."',
      `applicationEndDate: ${svNidhi?.applicationEndDate}, isOngoing: ${isOngoing}, processingPeriod: "${svNidhi?.processingPeriod}"`
    );
  } catch (e) {
    recordTest(17, 'Missing Government Data Handling', 'Data Integrity', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 18: User-Reported Approval Transparency
  // -------------------------------------------------------------------------
  try {
    const app = (await dbService.getApplications('USR-CITIZEN-001')).find(a => a.id === 'APP-2026-901');
    const isApproved = app.status === 'APPROVED';
    const isUserReported = app.statusOrigin === 'USER_REPORTED';
    const isNotOfficialGateway = app.statusOrigin !== 'OFFICIAL_INTEGRATION';

    const passed = isApproved && isUserReported && isNotOfficialGateway;
    recordTest(
      18,
      'User-Reported Approval Transparency',
      'Transparency',
      passed,
      'Application marked APPROVED retains statusOrigin: USER_REPORTED (never false official gateway claim)',
      `status: ${app?.status}, statusOrigin: ${app?.statusOrigin}`
    );
  } catch (e) {
    recordTest(18, 'User-Reported Approval Transparency', 'Transparency', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 19: Unknown / Unverifiable Scheme Ingestion
  // -------------------------------------------------------------------------
  try {
    const user = { name: 'Citizen', state: 'Delhi', income: 300000 };
    const aiResp = generateAssistantResponse('How do I apply for National Golden Grant 2026?', user, null, allSchemes);

    const containsRefusal = aiResp.text.includes("I couldn't verify this scheme from the available authoritative Government of India or State scheme records");
    const passed = containsRefusal;
    recordTest(
      19,
      'Unknown / Unverifiable Scheme Ingestion',
      'AI Safety',
      passed,
      'AI refuses to process unverifiable scheme and alerts citizen regarding official repository',
      `AI response contains verification refusal: ${containsRefusal}`
    );
  } catch (e) {
    recordTest(19, 'Unknown / Unverifiable Scheme Ingestion', 'AI Safety', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 20: Generic Missing Eligibility Profile Field
  // -------------------------------------------------------------------------
  try {
    // Pick scheme with mandatory structured eligibility rules (e.g. PM-KISAN or PMEGP)
    const scheme = allSchemes.find(s => s.structuredEligibility && s.structuredEligibility.some(r => r.mandatory));
    const mandatoryRule = scheme.structuredEligibility.find(r => r.mandatory);
    const requiredField = mandatoryRule.field;

    // Create a profile that explicitly lacks this mandatory field
    const incompleteProfile = {
      name: 'Test Citizen',
      state: 'Uttar Pradesh'
      // requiredField is deliberately omitted
    };

    const evalRes = evaluateStructuredEligibility(incompleteProfile, scheme);
    const isPotentiallyEligible = evalRes.result === 'POTENTIALLY_ELIGIBLE';
    const identifiesMissing = evalRes.missingMandatoryFields.length > 0;

    const passed = isPotentiallyEligible && identifiesMissing;
    recordTest(
      20,
      'Generic Missing Eligibility Profile Field',
      'Rule Engine',
      passed,
      'Result: POTENTIALLY_ELIGIBLE with missing mandatory field dynamically identified from scheme rules',
      `Result: ${evalRes.result}, missing fields: [${evalRes.missingMandatoryFields.join(', ')}]`
    );
  } catch (e) {
    recordTest(20, 'Generic Missing Eligibility Profile Field', 'Rule Engine', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 21: Source Change Detection & Audit
  // -------------------------------------------------------------------------
  try {
    const svanidhi = await dbService.getSchemeById('SCH-SVANIDHI-002');
    const updateRes = await dbService.updateSchemeWithAuditDiff(
      'SCH-SVANIDHI-002',
      {
        benefits: {
          ...svanidhi.benefits,
          maxLoanAmount: 100000 // Modified loan ceiling from 50k to 100k
        }
      },
      'MoHUA 3rd Tranche Enhancement Notification'
    );

    const auditHistory = await dbService.getAuditHistory('SCH-SVANIDHI-002');
    const auditEntry = auditHistory[0];
    const isNeedsReview = updateRes.scheme.verificationStatus === 'NEEDS_REVIEW' || auditEntry.status === 'NEEDS_REVIEW';

    const passed = updateRes.success && auditEntry && isNeedsReview;
    recordTest(
      21,
      'Source Change Detection & Audit',
      'Change Detection',
      passed,
      'Diff detected, logged in audit_history, and high-impact change transitions status to NEEDS_REVIEW',
      `Audit detected: ${Boolean(auditEntry)}, scheme verificationStatus: ${updateRes.scheme?.verificationStatus}, audit status: ${auditEntry?.status}`
    );
  } catch (e) {
    recordTest(21, 'Source Change Detection & Audit', 'Change Detection', false, 'Success', e.message);
  }

  // -------------------------------------------------------------------------
  // Test 22: Ongoing Mission Scheme Handling
  // -------------------------------------------------------------------------
  try {
    const mudra = allSchemes.find(s => s.id === 'SCH-MUDRA-003');
    const svNidhi = allSchemes.find(s => s.id === 'SCH-SVANIDHI-002');

    const mudraOngoing = mudra.isOngoing === true && (mudra.schemeStatus === 'ONGOING' || mudra.schemeStatus === 'OPEN');
    const svNidhiOngoing = svNidhi.isOngoing === true && (svNidhi.schemeStatus === 'ONGOING' || svNidhi.schemeStatus === 'OPEN');

    // Run automation and verify status is not expired
    await runScheduledAutomation();
    const mudraAfter = await dbService.getSchemeById('SCH-MUDRA-003');
    const svNidhiAfter = await dbService.getSchemeById('SCH-SVANIDHI-002');

    const notExpired = mudraAfter.schemeStatus !== 'EXPIRED' && svNidhiAfter.schemeStatus !== 'EXPIRED';
    const passed = mudraOngoing && svNidhiOngoing && notExpired;
    recordTest(
      22,
      'Ongoing Mission Scheme Handling',
      'Data Integrity',
      passed,
      'Ongoing flagship missions retain ONGOING status and are never marked EXPIRED',
      `MUDRA status: ${mudraAfter?.schemeStatus}, SVANidhi status: ${svNidhiAfter?.schemeStatus}`
    );
  } catch (e) {
    recordTest(22, 'Ongoing Mission Scheme Handling', 'Data Integrity', false, 'Success', e.message);
  }

  console.log('\n===============================================================');
  const totalPassed = testResults.filter(t => t.passed).length;
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${totalPassed} | FAILED: ${testResults.length - totalPassed}`);
  console.log('===============================================================\n');

  return {
    total: testResults.length,
    passed: totalPassed,
    failed: testResults.length - totalPassed,
    results: testResults
  };
}

runAll22Tests()
  .then(res => {
    if (res.failed > 0) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
