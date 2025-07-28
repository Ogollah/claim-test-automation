import { negativeSha01003, postiveSha01003} from "@/components/testCases/config/sha_01_003"
import { negativeSha01004, postiveSha01004 } from "@/components/testCases/config/sha_01_004"
import { negativeSha01005, postiveSha01005 } from "@/components/testCases/config/sha_01_005"
import { negativeSha01006, postiveSha01006 } from "@/components/testCases/config/sha_01_006"
import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

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
] 
