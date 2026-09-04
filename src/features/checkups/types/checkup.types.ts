export type LoginTypeLevel = 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type TelecomCode = 0 | 1 | 2;
export type InquiryType = 0 | 1 | 3 | 4;

export interface CheckupRequestInput {
  legalName: string;
  birthdate: string;
  phoneNo: string;
  telecom: TelecomCode;
  loginTypeLevel: LoginTypeLevel;
  startDate: string;
  endDate: string;
  inquiryType?: InquiryType;
}

export interface CheckupChallenge {
  transactionId: string;
  jobIndex: number;
  threadIndex: number;
  multiFactorTimestamp: number;
}

export interface CheckupOverview {
  checkupDate: string;
  height: string;
  weight: string;
  waist: string;
  bmi: string;
  vision: string;
  hearing: string;
  bloodPressure: string;
  proteinuria: string;
  hemoglobin: string;
  fastingBloodGlucose: string;
  totalCholesterol: string;
  hdlCholesterol: string;
  triglyceride: string;
  ldlCholesterol: string;
  serumCreatinine: string;
  gfr: string;
  ast: string;
  alt: string;
  ygpt: string;
  chestXrayResult: string;
  osteoporosis: string;
  evaluation: string;
}

export interface CheckupReference {
  refType: string;
  height?: string;
  weight?: string;
  waist?: string;
  bmi?: string;
  vision?: string;
  hearing?: string;
  bloodPressure?: string;
  proteinuria?: string;
  hemoglobin?: string;
  fastingBloodGlucose?: string;
  totalCholesterol?: string;
  hdlCholesterol?: string;
  triglyceride?: string;
  ldlCholesterol?: string;
  serumCreatinine?: string;
  gfr?: string;
  ast?: string;
  alt?: string;
  ygpt?: string;
  chestXrayResult?: string;
  osteoporosis?: string;
}

export interface CheckupRecord {
  caseType: string;
  checkupType: string;
  checkupDate: string;
  organizationName: string;
  pdfData: string;
  questionnaire: unknown[];
}

export interface CheckupData {
  patientName: string;
  overviews: CheckupOverview[];
  references: CheckupReference[];
  records: CheckupRecord[];
}
