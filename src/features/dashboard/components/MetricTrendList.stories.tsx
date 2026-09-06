import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { MetricTrendList } from './MetricTrendList';

const data = toCheckupData(checkupDataFixture);

const meta = {
  title: 'features/dashboard/MetricTrendList',
  component: MetricTrendList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'BMI·수축기 혈압·이완기 혈압의 검진일별 추이를 LineTrendChart로 보여줍니다. 검진이 2건 미만이면 추이라는 프레임이 성립하지 않아 아무것도 렌더링하지 않습니다.',
      },
    },
  },
} satisfies Meta<typeof MetricTrendList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metrics: toTrendMetrics(data),
  },
};

export const NotEnoughData: Story = {
  args: {
    metrics: toTrendMetrics({ ...data, overviews: [data.overviews[0]] }),
  },
  parameters: {
    docs: {
      description: { story: '검진이 1건뿐이면 아무것도 렌더링하지 않습니다.' },
    },
  },
};
