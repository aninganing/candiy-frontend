import type { CheckupOverview, CheckupReference } from '@/features/checkups/types/checkup.types';

export interface GaugeMetricConfig {
  key: keyof CheckupOverview & keyof CheckupReference;
  label: string;
  unit: string;
  min: number;
  max: number;
}

// 참고치가 성별조건/복합값 없이 단일 상·하한 패턴("60이상", "18.5-24.9" 등)으로만 되어 있는 항목만 우선 다룬다.
// 혈압·혈색소·r-GTP처럼 성별조건/복합값이 섞인 항목은 이번 범위에서 제외.
export const GAUGE_METRICS: GaugeMetricConfig[] = [
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', min: 10, max: 40 },
  { key: 'fastingBloodGlucose', label: '공복혈당', unit: 'mg/dL', min: 50, max: 200 },
  { key: 'totalCholesterol', label: '총콜레스테롤', unit: 'mg/dL', min: 100, max: 300 },
  { key: 'hdlCholesterol', label: 'HDL 콜레스테롤', unit: 'mg/dL', min: 20, max: 100 },
  { key: 'ldlCholesterol', label: 'LDL 콜레스테롤', unit: 'mg/dL', min: 50, max: 220 },
  { key: 'triglyceride', label: '중성지방', unit: 'mg/dL', min: 30, max: 300 },
  { key: 'gfr', label: 'GFR', unit: 'mL/min', min: 0, max: 120 },
  { key: 'ast', label: 'AST', unit: 'U/L', min: 0, max: 80 },
  { key: 'alt', label: 'ALT', unit: 'U/L', min: 0, max: 80 },
  { key: 'serumCreatinine', label: '혈청크레아티닌', unit: 'mg/dL', min: 0, max: 3 },
];

export interface HistoryFieldConfig {
  key: keyof CheckupOverview;
  label: string;
}

export interface HistorySectionConfig {
  title: string;
  fields: HistoryFieldConfig[];
}

// 검진 이력 상세에서 CheckupOverview의 22개 항목 전체를 보여줄 때 쓰는 그룹핑.
export const HISTORY_SECTIONS: HistorySectionConfig[] = [
  {
    title: '신체계측',
    fields: [
      { key: 'height', label: '신장' },
      { key: 'weight', label: '체중' },
      { key: 'waist', label: '허리둘레' },
      { key: 'bmi', label: 'BMI' },
    ],
  },
  {
    title: '시청각',
    fields: [
      { key: 'vision', label: '시력' },
      { key: 'hearing', label: '청력' },
    ],
  },
  {
    title: '순환기',
    fields: [{ key: 'bloodPressure', label: '혈압' }],
  },
  {
    title: '요검사',
    fields: [{ key: 'proteinuria', label: '요단백' }],
  },
  {
    title: '혈액검사',
    fields: [
      { key: 'hemoglobin', label: '혈색소' },
      { key: 'fastingBloodGlucose', label: '공복혈당' },
      { key: 'totalCholesterol', label: '총콜레스테롤' },
      { key: 'hdlCholesterol', label: 'HDL콜레스테롤' },
      { key: 'triglyceride', label: '중성지방' },
      { key: 'ldlCholesterol', label: 'LDL콜레스테롤' },
      { key: 'serumCreatinine', label: '혈청크레아티닌' },
      { key: 'gfr', label: 'GFR' },
      { key: 'ast', label: 'AST' },
      { key: 'alt', label: 'ALT' },
      { key: 'ygpt', label: '감마지티피(γ-GTP)' },
    ],
  },
  {
    title: '영상 · 골밀도',
    fields: [
      { key: 'chestXrayResult', label: '흉부촬영' },
      { key: 'osteoporosis', label: '골밀도' },
    ],
  },
  {
    title: '종합소견',
    fields: [{ key: 'evaluation', label: '종합판정' }],
  },
];
