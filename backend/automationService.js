// SAHAYAK AI — Idempotent Server-Side Scheduled Automation Engine
// Production trigger: Vercel Cron (0 0 * * *) via /api/cron
// Manual/test trigger: /api/automation/run

import { dbService } from './db.js';

export async function runScheduledAutomation() {
  const result = {
    success: true,
    timestamp: new Date().toISOString(),
    schemesEvaluated: 0,
    schemesUpdated: 0,
    applicationsEvaluated: 0,
    waitingPeriodsUpdated: 0,
    notificationsGenerated: 0,
    duplicatesSkipped: 0,
    details: []
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // 1. Process Schemes: Deadlines, Window Closures, Expirations, and Ongoing Mission status
  const schemes = await dbService.getSchemes();
  for (const scheme of schemes) {
    result.schemesEvaluated++;
    const sId = scheme.id || scheme.schemeId;
    let updatedStatus = scheme.schemeStatus;
    let needsUpdate = false;

    // Ongoing Mission Schemes are never expired
    if (scheme.isOngoing) {
      if (scheme.schemeStatus !== 'ONGOING' && scheme.schemeStatus !== 'CLOSING_SOON') {
        updatedStatus = 'ONGOING';
        needsUpdate = true;
      }
    }

    // Check application window if deadline is set
    if (scheme.applicationEndDate) {
      const endDate = new Date(scheme.applicationEndDate);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        // Window closed, but ongoing scheme does not permanently expire
        if (scheme.schemeStatus !== 'APPLICATION_WINDOW_CLOSED') {
          updatedStatus = 'APPLICATION_WINDOW_CLOSED';
          needsUpdate = true;
          result.details.push(`Scheme ${sId} window closed (${scheme.applicationEndDate}).`);
        }
      } else if (diffDays >= 0 && diffDays <= 7) {
        if (scheme.schemeStatus !== 'CLOSING_SOON') {
          updatedStatus = 'CLOSING_SOON';
          needsUpdate = true;
        }

        // Generate idempotent SCHEME_DEADLINE_APPROACHING notification
        const idempotencyKey = `all_${sId}_none_SCHEME_DEADLINE_APPROACHING_${todayStr}`;
        const notifResult = await dbService.createNotification({
          idempotencyKey,
          userId: 'all',
          schemeId: sId,
          type: 'SCHEME_DEADLINE_APPROACHING',
          title: `Deadline Approaching: ${scheme.shortName || scheme.officialName}`,
          message: `The application window for ${scheme.officialName || scheme.name} closes in ${diffDays} day(s) on ${scheme.applicationEndDate}. Verify documents and apply through the official portal.`,
          priority: diffDays <= 2 ? 'CRITICAL' : 'HIGH',
          actionLink: `/schemes/${sId}`
        });

        if (notifResult.success) {
          result.notificationsGenerated++;
        } else if (notifResult.duplicate) {
          result.duplicatesSkipped++;
        }
      }
    }

    // Scheme Expiry: Only if schemeExpiryDate is set and scheme is NOT ongoing
    if (scheme.schemeExpiryDate && !scheme.isOngoing) {
      const expDate = new Date(scheme.schemeExpiryDate);
      if (expDate.getTime() < now.getTime()) {
        if (scheme.schemeStatus !== 'EXPIRED') {
          updatedStatus = 'EXPIRED';
          needsUpdate = true;
          result.details.push(`Scheme ${sId} permanently expired on ${scheme.schemeExpiryDate}.`);
        }
      }
    }

    if (needsUpdate && updatedStatus !== scheme.schemeStatus) {
      await dbService.updateScheme(sId, {
        schemeStatus: updatedStatus,
        lastUpdatedAt: new Date().toISOString()
      });
      result.schemesUpdated++;
    }
  }

  // 2. Process Applications: Waiting Period Tracking
  const applications = await dbService.getApplications();
  for (const app of applications) {
    result.applicationsEvaluated++;
    const isPending =
      app.status === 'SUBMITTED' ||
      app.status === 'UNDER_REVIEW' ||
      app.status === 'PARTNER_REVIEW';

    if (isPending && app.expectedDecisionDate) {
      const decDate = new Date(app.expectedDecisionDate);
      const diffDays = Math.ceil((decDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let newWaitingStatus = app.waitingPeriodStatus || 'WAITING_PERIOD';
      let notifType = null;
      let notifTitle = '';
      let notifMsg = '';

      if (diffDays <= 0) {
        if (app.waitingPeriodStatus !== 'WAITING_PERIOD_COMPLETED') {
          newWaitingStatus = 'WAITING_PERIOD_COMPLETED';
          notifType = 'WAITING_PERIOD_COMPLETED';
          notifTitle = `Waiting Period Concluded: ${app.schemeName}`;
          notifMsg = `The expected decision date (${app.expectedDecisionDate}) for application ${app.id} has concluded. Please check the official government portal for status updates.`;
        }
      } else if (diffDays <= 5) {
        if (app.waitingPeriodStatus !== 'WAITING_PERIOD_ENDING') {
          newWaitingStatus = 'WAITING_PERIOD_ENDING';
          notifType = 'WAITING_PERIOD_ENDING';
          notifTitle = `Decision Expected Soon: ${app.schemeName}`;
          notifMsg = `Application ${app.id} is nearing its expected decision timeframe (${diffDays} days remaining until ${app.expectedDecisionDate}).`;
        }
      }

      if (newWaitingStatus !== app.waitingPeriodStatus) {
        await dbService.updateApplication(app.id, {
          waitingPeriodStatus: newWaitingStatus
        });
        result.waitingPeriodsUpdated++;
      }

      if (notifType) {
        const idempotencyKey = `${app.userId}_${app.schemeId}_${app.id}_${notifType}_${todayStr}`;
        const notifRes = await dbService.createNotification({
          idempotencyKey,
          userId: app.userId,
          schemeId: app.schemeId,
          applicationId: app.id,
          type: notifType,
          title: notifTitle,
          message: notifMsg,
          priority: 'NORMAL',
          actionLink: '/applications'
        });

        if (notifRes.success) {
          result.notificationsGenerated++;
        } else if (notifRes.duplicate) {
          result.duplicatesSkipped++;
        }
      }
    }
  }

  return result;
}
