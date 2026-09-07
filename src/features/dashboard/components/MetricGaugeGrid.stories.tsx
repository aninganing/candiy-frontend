import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { MetricGaugeGrid } from './MetricGaugeGrid';

const data = toCheckupData(checkupDataFixture);

const meta = {
  title: 'features/dashboard/MetricGaugeGrid',
  component: MetricGaugeGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'config/metrics.ts의 GAUGE_METRICS 중 참고치를 단일 상·하한으로 파싱할 수 있는 항목만 GaugeRangeChart로 표시합니다.',
      },
    },
  },
} satisfies Meta<typeof MetricGaugeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metrics: toGaugeMetrics(data.overviews[0], data.references),
  },
};
