import { api, API_BASE_URL, CLAIM_STATUS } from '@/lib/utils';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches the current outcome status of a claim, after a 1-second delay.
 * @param claimId The ID of the claim to check
 * @returns Promise<string> The claim outcome (e.g., "Approved", "Pending", etc.)
 */
export const getClaimOutcome = async (claimId: string): Promise<string> => {
  try {
    await delay(1000);

    const response = await api.get<any>(`${API_BASE_URL}/api/claims/${claimId}`);

    console.log('printlogs', response.data.data);

    const ext = response.data?.data?.extension?.find(
      (i: any) => i.url.endsWith('claim-state-extension')
    );

    const valueCode = ext?.valueCodeableConcept?.coding?.find(
      (s: any) => s.system.endsWith('claim-state')
    );

    return valueCode?.display || '';
  } catch (error) {
    console.error('Error getting claim outcome:', error);
    throw error;
  }
};


/**
 * Refreshes a test result by fetching the latest claim status
 * @param claimId The ID of the claim to refresh
 * @returns Promise<{outcome: string, status: 'passed' | 'failed', message: string}>
 */
export const refreshTestResult = async (
  claimId: string,
  test?: string
): Promise<{
  outcome: string;
  status: 'passed' | 'failed';
  message: string;
  ruleStatus: string;
}> => {
  try {
    const newOutcome = await getClaimOutcome(claimId);

    return {
      outcome: newOutcome,
      ruleStatus: newOutcome,
      status:
        (test === 'negative' && [CLAIM_STATUS.REJECTED, CLAIM_STATUS.DECLINED, CLAIM_STATUS.SENT_BACK, CLAIM_STATUS.DECLINE].includes(newOutcome)) ||
          [CLAIM_STATUS.APPROVED, CLAIM_STATUS.SENT_FOR_PAYMENT, CLAIM_STATUS.CLINICAL_REVIEW].includes(newOutcome)
          ? 'passed'
          : 'failed',
      message: `Refreshed: ${newOutcome}`,
    };

  } catch (error) {
    console.error('Error refreshing claim status:', error);
    throw error;
  }
};

/**
 * Determines if a test should pass based on its type and outcome
 * @param testType The type of test ('positive', 'negative')
 * @param outcome The claim outcome
 * @returns boolean Whether the test should pass
 */
export const shouldTestPass = (
  testType: string,
  outcome: string,
  response: boolean
): boolean => {
  const positiveOutcomes = [CLAIM_STATUS.APPROVED, CLAIM_STATUS.SENT_FOR_PAYMENT, CLAIM_STATUS.CLINICAL_REVIEW, CLAIM_STATUS.MANUAL_REVIEW];
  const negativeOutCome = [CLAIM_STATUS.DECLINED, CLAIM_STATUS.REJECTED, CLAIM_STATUS.SENT_BACK, CLAIM_STATUS.DECLINE];

  if (response === true && (testType === 'positive' || testType === 'build' || testType === 'complex')) {
    return positiveOutcomes.includes(outcome);
  } else if (testType === 'negative') {
    return negativeOutCome.includes(outcome);
  }
  return false;
};