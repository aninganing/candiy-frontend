import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { HistoryPanel } from './HistoryPanel';

const data = toCheckupData(checkupDataFixture);

const meta = {
  title: 'features/dashboard/HistoryPanel',
  component: HistoryPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '과거 모든 검진 이력을 볼 수 있는 패널입니다. 검진일 pill로 회차를 고르면 CheckupOverview의 22개 항목 전체를 7개 섹션으로 나눠 보여줍니다. 참고치를 단일 상·하한으로 파싱할 수 있는 항목(MetricGaugeGrid와 동일한 GAUGE_METRICS)은 상태 배지와 게이지를 함께 표시하고, 성별조건/복합값처럼 파싱할 수 없는 항목은 값과 참고치 원문만 보여줍니다.',
      },
    },
  },
} satisfies Meta<typeof HistoryPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    overviews: data.overviews,
    references: data.references,
  },
};
