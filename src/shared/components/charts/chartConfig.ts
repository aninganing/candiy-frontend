import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartType,
} from 'chart.js';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
);

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- 원본 인터페이스 시그니처를 맞추기 위한 타입 매개변수
  interface PluginOptionsByType<TType extends ChartType> {
    gaugeVisuals?: {
      min: number;
      value: number;
      fillColor: string;
      boundary: number;
      boundaryColor: string;
    };
    lineReference?:
      | { kind: 'band'; low: number; high: number; bandColor: string; lineColor: string }
      | { kind: 'line'; boundary: number; lineColor: string };
    barThreshold?: {
      value: number;
      label?: string;
      lineColor: string;
    };
    barValueLabels?: {
      color: string;
    };
  }
}
