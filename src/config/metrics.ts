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
