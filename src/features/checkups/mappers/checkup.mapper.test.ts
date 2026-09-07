import { describe, expect, it } from 'vitest';
import type {
  CheckupFinalResponseDataDto,
  CheckupMultiFactorInfoDto,
  CheckupOverviewDto,
  CheckupReferenceDto,
  CheckupResultItemDto,
} from '@/features/checkups/api/checkup.dto';
import {
  toCheckupChallenge,
  toCheckupData,
  toCheckupOverview,
  toCheckupRecord,
  toCheckupReference,
} from './checkup.mapper';

describe('toCheckupChallenge', () => {
  it('2차 인증에 필요한 필드를 그대로 옮긴다', () => {
    const dto: CheckupMultiFactorInfoDto = {
      transactionId: '04cddf76-e720-453f-8a18-1c0e4e82358d',
      jobIndex: 3,
      threadIndex: 0,
      multiFactorTimestamp: 1707980368,
    };

    expect(toCheckupChallenge(dto)).toEqual({
      transactionId: '04cddf76-e720-453f-8a18-1c0e4e82358d',
      jobIndex: 3,
      threadIndex: 0,
      multiFactorTimestamp: 1707980368,
    });
  });
});

describe('toCheckupOverview', () => {
  it('waists/BMI/HDLCholesterol 등 CANDiY 필드명을 도메인 camelCase로 변환한다', () => {
    const dto: CheckupOverviewDto = {
      checkupDate: '2024-05-10',
      height: '170.5',
      weight: '68.2',
      waists: '82',
      BMI: '23.5',
      vision: '1.0/1.0',
      hearing: '정상/정상',
      bloodPressure: '118/76',
      proteinuria: '음성',
      hemoglobin: '14.8',
      fastingBloodGlucose: '92',
      totalCholesterol: '184',
      HDLCholesterol: '58',
      triglyceride: '110',
      LDLCholesterol: '104',
      serumCreatinine: '0.9',
      GFR: '98',
      AST: '22',
      ALT: '20',
      yGPT: '25',
      chestXrayResult: '정상',
      osteoporosis: 'T-score -0.5',
      evaluation: '정A',
    };

    expect(toCheckupOverview(dto)).toEqual({
      checkupDate: '2024-05-10',
      height: '170.5',
      weight: '68.2',
      waist: '82',
      bmi: '23.5',
      vision: '1.0/1.0',
      hearing: '정상/정상',
      bloodPressure: '118/76',
      proteinuria: '음성',
      hemoglobin: '14.8',
      fastingBloodGlucose: '92',
      totalCholesterol: '184',
      hdlCholesterol: '58',
      triglyceride: '110',
      ldlCholesterol: '104',
      serumCreatinine: '0.9',
      gfr: '98',
      ast: '22',
      alt: '20',
      ygpt: '25',
      chestXrayResult: '정상',
      osteoporosis: 'T-score -0.5',
      evaluation: '정A',
    });
  });
});

describe('toCheckupReference', () => {
  it('refType과 선택적 참고치 필드를 변환한다', () => {
    const dto: CheckupReferenceDto = {
      refType: '정상(A)',
      BMI: '18.5-24.9',
      bloodPressure: '120미만 이며/80미만',
      hemoglobin: '남: 13-16.5 / 여: 12-15.5',
    };

    expect(toCheckupReference(dto)).toEqual({
      refType: '정상(A)',
      height: undefined,
      weight: undefined,
      waist: undefined,
      bmi: '18.5-24.9',
      vision: undefined,
      hearing: undefined,
      bloodPressure: '120미만 이며/80미만',
      proteinuria: undefined,
      hemoglobin: '남: 13-16.5 / 여: 12-15.5',
      fastingBloodGlucose: undefined,
      totalCholesterol: undefined,
      hdlCholesterol: undefined,
      triglyceride: undefined,
      ldlCholesterol: undefined,
      serumCreatinine: undefined,
      gfr: undefined,
      ast: undefined,
      alt: undefined,
      ygpt: undefined,
      chestXrayResult: undefined,
      osteoporosis: undefined,
    });
  });
});

describe('toCheckupRecord', () => {
  it('검진 결과 목록 항목을 그대로 옮긴다', () => {
    const dto: CheckupResultItemDto = {
      caseType: '0',
      checkupType: '일반',
      checkupDate: '20240510',
      organizationName: '서울병원',
      pdfData: 'base64-data',
      questionnaire: [],
    };

    expect(toCheckupRecord(dto)).toEqual({
      caseType: '0',
      checkupType: '일반',
      checkupDate: '20240510',
      organizationName: '서울병원',
      pdfData: 'base64-data',
      questionnaire: [],
    });
  });
});

describe('toCheckupData', () => {
  it('overviewList/referenceList/resultList를 각각 도메인 배열로 변환한다', () => {
    const dto: CheckupFinalResponseDataDto = {
      patientName: '홍길동',
      overviewList: [
        {
          checkupDate: '2024-05-10',
          height: '170.5',
          weight: '68.2',
          waists: '82',
          BMI: '23.5',
          vision: '1.0/1.0',
          hearing: '정상/정상',
          bloodPressure: '118/76',
          proteinuria: '음성',
          hemoglobin: '14.8',
          fastingBloodGlucose: '92',
          totalCholesterol: '184',
          HDLCholesterol: '58',
          triglyceride: '110',
          LDLCholesterol: '104',
          serumCreatinine: '0.9',
          GFR: '98',
          AST: '22',
          ALT: '20',
          yGPT: '25',
          chestXrayResult: '정상',
          osteoporosis: 'T-score -0.5',
          evaluation: '정A',
        },
      ],
      referenceList: [{ refType: '단위', BMI: 'kg/m2' }],
      resultList: [
        {
          caseType: '0',
          checkupType: '일반',
          checkupDate: '20240510',
          organizationName: '서울병원',
          pdfData: 'base64-data',
          questionnaire: [],
        },
      ],
    };

    const result = toCheckupData(dto);

    expect(result.patientName).toBe('홍길동');
    expect(result.overviews).toHaveLength(1);
    expect(result.references).toHaveLength(1);
    expect(result.records).toHaveLength(1);
    expect(result.overviews[0].waist).toBe('82');
    expect(result.references[0].bmi).toBe('kg/m2');
  });
});
