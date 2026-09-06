export interface CandiySuccessResponseDto<T> {
  status: 'success';
  data: T;
}

export interface CheckupInitiateRequestDto {
  id: string;
  loginTypeLevel: string;
  legalName: string;
  birthdate: string;
  phoneNo: string;
  telecom: string;
  startDate: string;
  endDate: string;
  inquiryType?: string;
}

export interface CheckupMultiFactorInfoDto {
  transactionId: string;
  jobIndex: number;
  threadIndex: number;
  multiFactorTimestamp: number;
}

export interface CheckupVerifyRequestDto extends CheckupInitiateRequestDto {
  isContinue: string;
  multiFactorInfo: CheckupMultiFactorInfoDto;
}

export type CheckupInitiateResponseDto = CandiySuccessResponseDto<CheckupMultiFactorInfoDto>;

export interface CheckupOverviewDto {
  checkupDate: string;
  height: string;
  weight: string;
  waists: string;
  BMI: string;
  vision: string;
  hearing: string;
  bloodPressure: string;
  proteinuria: string;
  hemoglobin: string;
  fastingBloodGlucose: string;
  totalCholesterol: string;
  HDLCholesterol: string;
  triglyceride: string;
  LDLCholesterol: string;
  serumCreatinine: string;
  GFR: string;
  AST: string;
  ALT: string;
  yGPT: string;
  chestXrayResult: string;
  osteoporosis: string;
  evaluation: string;
}

export interface CheckupReferenceDto {
  refType: string;
  height?: string;
  weight?: string;
  waists?: string;
  BMI?: string;
  vision?: string;
  hearing?: string;
  bloodPressure?: string;
  proteinuria?: string;
  hemoglobin?: string;
  fastingBloodGlucose?: string;
  totalCholesterol?: string;
  HDLCholesterol?: string;
  triglyceride?: string;
  LDLCholesterol?: string;
  serumCreatinine?: string;
  GFR?: string;
  AST?: string;
  ALT?: string;
  yGPT?: string;
  chestXrayResult?: string;
  osteoporosis?: string;
}

export interface CheckupResultItemDto {
  caseType: string;
  checkupType: string;
  checkupDate: string;
  organizationName: string;
  pdfData: string;
  questionnaire: unknown[];
}

export interface CheckupFinalResponseDataDto {
  patientName: string;
  overviewList: CheckupOverviewDto[];
  referenceList: CheckupReferenceDto[];
  resultList: CheckupResultItemDto[];
}

export type CheckupVerifyResponseDto = CandiySuccessResponseDto<CheckupFinalResponseDataDto>;
