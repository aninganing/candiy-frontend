import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toLipidPanel } from '@/features/dashboard/mappers/lipidPanel.mapper';
import { LipidPanelChart } from './LipidPanelChart';

const data = toLipidPanel(toCheckupData(checkupDataFixture));

const meta = {
  title: 'features/dashboard/LipidPanelChart',
  component: LipidPanelChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '총콜레스테롤·LDL콜레스테롤·중성지방을 각자의 질환의심 기준(=100%) 대비 비율로 환산해 BarComparisonChart로 비교합니다. HDL/GFR처럼 낮을수록 위험한 방향의 항목은 % 프레임과 맞지 않아 제외합니다.',
      },
    },
  },
} satisfies Meta<typeof LipidPanelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data },
};

export const NoData: Story = {
  args: { data: null },
  parameters: {
    docs: {
      description: { story: '지질 3항목 모두 참고치 파싱이 안 되면 안내 문구를 보여줍니다.' },
    },
  },
};

export const PartialData: Story = {
  args: { data: data && { ...data, series: data.series.slice(0, 2) } },
  parameters: {
    docs: {
      description: {
        story: '일부 항목만 파싱 가능할 때도 나머지 항목의 색상을 유지하며 표시합니다.',
      },
    },
  },
};
