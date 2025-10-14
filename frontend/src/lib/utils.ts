import { negativeSha01003, postiveSha01003 } from "@/components/testCases/config/sha_01_003"
import { negativeSha01004, postiveSha01004 } from "@/components/testCases/config/sha_01_004"
import { negativeSha01005, postiveSha01005 } from "@/components/testCases/config/sha_01_005"
import { negativeSha01006, postiveSha01006 } from "@/components/testCases/config/sha_01_006"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const testCasePackageSHA01 = {
  id: 'SHA-01',
  name: 'Ambulance and Emergency Services',
  SHA01InteventionTestCases: [
    { code: 'SHA-01-003', positive: postiveSha01003, negative: negativeSha01003, },
    { code: 'SHA-01-004', positive: postiveSha01004, negative: negativeSha01004 },
    { code: 'SHA-01-005', positive: postiveSha01005, negative: negativeSha01005 },
    { code: 'SHA-01-006', positive: postiveSha01006, negative: negativeSha01006 },
    { code: 'SHA-01-007', positive: [], negative: [] },
    { code: 'SHA-01-008', positive: [], negative: [] },
  ]
}
export const testCasesPackages = [
  testCasePackageSHA01,
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const HIE_URL = {
  BASE_URL: 'https://qa-mis.apeiro-digital.com/fhir',
  AUTH_URL: 'https://qa-auth.apeiro-digital.com/auth/realms/camunda-platform/protocol/openid-connect/token',
  QUERY_PATIENT_URL: 'https://qa-payers.apeiro-digital.com/api/v1/insurance-claim/all/page-claim',
  PATHS: {
    PATIENT: 'Patient',
    ORGANIZATION: 'Organization',
    CLAIM: 'Claim',
    PRACTITIONER: 'Practitioner',
    IDENTIFIER: 'identifier',
    GRANT_TYPE: 'authorization_code',
    CLIENT_ID: 'eclaimportal'
  },
  VALUE_STRINGS: {
    SHA: 'SOCIAL HEALTH AUTHORITY',
    COVERAGE: 'sha-coverage',
    CAT_SHA: 'CAT-SHA-001'
  },

};

export const CLAIM_STATUS = {
  APPROVED: "Approved",
  SENT_FOR_PAYMENT: "Sent for payment processing",
  CLINICAL_REVIEW: "Medical Review",
  IN_REVIEW: "In Review",
  PASSED: "passed",
  FAILED: "failed",
  REJECTED: "Rejected",
  SENT_BACK: "Returned back",
  DECLINED: "Declined",
  DECLINE: "Decline",
  MANUAL_REVIE: "Manual Review"

};

export const PER_DIEM_CODES = new Set([
  'SHA-07-006', 'SHA-07-005', 'SHA-03-002', 'SHA-10-005',
  'SHA-10-001', 'SHA-10-002', 'SHA-10-003', 'SHA-10-004',
  'SHA-13-001', 'SHA-07-001', 'SHA-07-002', 'SHA-03-005',
  'SHA-03-001', 'SHA-03-004', 'SHA-03-003'
]);
