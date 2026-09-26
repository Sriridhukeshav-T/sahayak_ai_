import { Scheme, StructuredEligibilityRule } from '../types/scheme';
import { UserProfile } from '../types/user';

export type EligibilityResult = 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';

export interface RuleEvaluation {
  rule: StructuredEligibilityRule;
  passed: boolean;
  missingData: boolean;
  actualValue: any;
  reason: string;
}

export interface SchemeEligibilityEvaluation {
  schemeId: string;
  schemeName: string;
  result: EligibilityResult;
  mandatoryRulesPassed: number;
  mandatoryRulesTotal: number;
  missingMandatoryFields: string[];
  failedMandatoryRules: string[];
  ruleEvaluations: RuleEvaluation[];
  summary: string;
}

export function evaluateStructuredEligibility(
  profile: Partial<UserProfile> & Record<string, any>,
  scheme: Scheme
): SchemeEligibilityEvaluation {
  const rules = scheme.structuredEligibility || [];
  const evaluations: RuleEvaluation[] = [];
  const missingMandatoryFields: string[] = [];
  const failedMandatoryRules: string[] = [];
  let mandatoryRulesPassed = 0;
  let mandatoryRulesTotal = 0;

  for (const rule of rules) {
    if (rule.mandatory) {
      mandatoryRulesTotal++;
    }

    const fieldKey = rule.field;
    const actualValue = profile[fieldKey];

    // Check if the user profile has this field provided
    if (actualValue === undefined || actualValue === null || actualValue === '') {
      const isMissing = true;
      if (rule.mandatory) {
        missingMandatoryFields.push(rule.label || fieldKey);
      }
      evaluations.push({
        rule,
        passed: false,
        missingData: isMissing,
        actualValue: undefined,
        reason: `${rule.label || fieldKey} is required for verification but not provided in citizen profile.`
      });
      continue;
    }

    let passed = false;
    let reason = '';

    switch (rule.operator) {
      case '>=': {
        const numVal = Number(actualValue);
        const reqVal = Number(rule.value);
        passed = !isNaN(numVal) && numVal >= reqVal;
        reason = passed
          ? `${rule.label}: Value (${numVal}) satisfies requirement (>= ${reqVal}).`
          : `${rule.label}: Stated value (${numVal}) is below required minimum (${reqVal}).`;
        break;
      }
      case '<=': {
        const numVal = Number(actualValue);
        const reqVal = Number(rule.value);
        passed = !isNaN(numVal) && numVal <= reqVal;
        reason = passed
          ? `${rule.label}: Value (${numVal}) satisfies limit (<= ${reqVal}).`
          : `${rule.label}: Stated value (${numVal}) exceeds ceiling limit (${reqVal}).`;
        break;
      }
      case '==': {
        const actualStr = String(actualValue).toLowerCase().trim();
        const reqStr = String(rule.value).toLowerCase().trim();
        passed = actualStr === reqStr;
        reason = passed
          ? `${rule.label}: Matches required "${rule.value}".`
          : `${rule.label}: Expected "${rule.value}", citizen profile has "${actualValue}".`;
        break;
      }
      case 'in': {
        const list: any[] = Array.isArray(rule.value) ? rule.value : [rule.value];
        const valStr = String(actualValue).toLowerCase().trim();
        passed = list.some(item => String(item).toLowerCase().trim() === valStr || String(item).toLowerCase() === 'all');
        reason = passed
          ? `${rule.label}: "${actualValue}" is eligible.`
          : `${rule.label}: "${actualValue}" is not in the eligible criteria [${list.join(', ')}].`;
        break;
      }
      case 'not_in': {
        const list: any[] = Array.isArray(rule.value) ? rule.value : [rule.value];
        const valStr = String(actualValue).toLowerCase().trim();
        passed = !list.some(item => String(item).toLowerCase().trim() === valStr);
        reason = passed
          ? `${rule.label}: Satisfied non-exclusion rule.`
          : `${rule.label}: "${actualValue}" is excluded under scheme guidelines.`;
        break;
      }
      case 'boolean_true': {
        passed = Boolean(actualValue) === true;
        reason = passed
          ? `${rule.label}: Confirmed.`
          : `${rule.label}: Must be confirmed/true to qualify.`;
        break;
      }
      case 'boolean_false': {
        passed = Boolean(actualValue) === false;
        reason = passed
          ? `${rule.label}: Confirmed non-applicable.`
          : `${rule.label}: Must be false/absent to qualify.`;
        break;
      }
      default: {
        // Fallback equality
        passed = String(actualValue) === String(rule.value);
        reason = passed ? `${rule.label}: Satisfied.` : `${rule.label}: Requirement not met.`;
      }
    }

    if (rule.mandatory) {
      if (passed) {
        mandatoryRulesPassed++;
      } else {
        failedMandatoryRules.push(rule.label || fieldKey);
      }
    }

    evaluations.push({
      rule,
      passed,
      missingData: false,
      actualValue,
      reason
    });
  }

  // Derive Deterministic Result
  let result: EligibilityResult = 'ELIGIBLE';
  let summary = '';

  if (failedMandatoryRules.length > 0) {
    result = 'NOT_ELIGIBLE';
    summary = `Does not meet ${failedMandatoryRules.length} mandatory requirement(s): ${failedMandatoryRules.join(', ')}.`;
  } else if (missingMandatoryFields.length > 0) {
    result = 'POTENTIALLY_ELIGIBLE';
    summary = `Profile satisfies evaluated criteria, but ${missingMandatoryFields.length} mandatory field(s) require confirmation: ${missingMandatoryFields.join(', ')}.`;
  } else {
    result = 'ELIGIBLE';
    summary = `Citizen profile meets all ${mandatoryRulesTotal} mandatory eligibility criteria for ${scheme.officialName}.`;
  }

  return {
    schemeId: scheme.id || scheme.schemeId,
    schemeName: scheme.officialName || scheme.name,
    result,
    mandatoryRulesPassed,
    mandatoryRulesTotal,
    missingMandatoryFields,
    failedMandatoryRules,
    ruleEvaluations: evaluations,
    summary
  };
}
