import type {
  CheckupFinalResponseDataDto,
  CheckupMultiFactorInfoDto,
  CheckupOverviewDto,
  CheckupReferenceDto,
  CheckupResultItemDto,
} from '@/features/checkups/api/checkup.dto';
import type {
  CheckupChallenge,
  CheckupData,
  CheckupOverview,
  CheckupRecord,
  CheckupReference,
} from '@/features/checkups/types/checkup.types';

export function toCheckupChallenge(dto: CheckupMultiFactorInfoDto): CheckupChallenge {
  return {
    transactionId: dto.transactionId,
    jobIndex: dto.jobIndex,
    threadIndex: dto.threadIndex,
    multiFactorTimestamp: dto.multiFactorTimestamp,
  };
}

export function toCheckupOverview(dto: CheckupOverviewDto): CheckupOverview {
  return {
    checkupDate: dto.checkupDate,
    height: dto.height,
    weight: dto.weight,
    waist: dto.waists,
    bmi: dto.BMI,
    vision: dto.vision,
    hearing: dto.hearing,
    bloodPressure: dto.bloodPressure,
    proteinuria: dto.proteinuria,
    hemoglobin: dto.hemoglobin,
    fastingBloodGlucose: dto.fastingBloodGlucose,
    totalCholesterol: dto.totalCholesterol,
    hdlCholesterol: dto.HDLCholesterol,
    triglyceride: dto.triglyceride,
    ldlCholesterol: dto.LDLCholesterol,
    serumCreatinine: dto.serumCreatinine,
    gfr: dto.GFR,
    ast: dto.AST,
    alt: dto.ALT,
    ygpt: dto.yGPT,
    chestXrayResult: dto.chestXrayResult,
    osteoporosis: dto.osteoporosis,
    evaluation: dto.evaluation,
  };
}

export function toCheckupReference(dto: CheckupReferenceDto): CheckupReference {
  return {
    refType: dto.refType,
    height: dto.height,
    weight: dto.weight,
    waist: dto.waists,
    bmi: dto.BMI,
    vision: dto.vision,
    hearing: dto.hearing,
    bloodPressure: dto.bloodPressure,
    proteinuria: dto.proteinuria,
    hemoglobin: dto.hemoglobin,
    fastingBloodGlucose: dto.fastingBloodGlucose,
    totalCholesterol: dto.totalCholesterol,
    hdlCholesterol: dto.HDLCholesterol,
    triglyceride: dto.triglyceride,
    ldlCholesterol: dto.LDLCholesterol,
    serumCreatinine: dto.serumCreatinine,
    gfr: dto.GFR,
    ast: dto.AST,
    alt: dto.ALT,
    ygpt: dto.yGPT,
    chestXrayResult: dto.chestXrayResult,
    osteoporosis: dto.osteoporosis,
  };
}

export function toCheckupRecord(dto: CheckupResultItemDto): CheckupRecord {
  return {
    caseType: dto.caseType,
    checkupType: dto.checkupType,
    checkupDate: dto.checkupDate,
    organizationName: dto.organizationName,
    pdfData: dto.pdfData,
    questionnaire: dto.questionnaire,
  };
}

export function toCheckupData(dto: CheckupFinalResponseDataDto): CheckupData {
  return {
    patientName: dto.patientName,
    overviews: dto.overviewList.map(toCheckupOverview),
    references: dto.referenceList.map(toCheckupReference),
    records: dto.resultList.map(toCheckupRecord),
  };
}
