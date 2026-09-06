import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { RecentCheckupSummary } from './RecentCheckupSummary';

const data = toCheckupData(checkupDataFixture);
const overview = data.overviews[0];

const meta = {
  title: 'features/dashboard/RecentCheckupSummary',
  component: RecentCheckupSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '환자 요약 + 핵심 수치(신장/체중/혈압/BMI) + 게이지/추이를 한 카드로 묶어 가장 최근 검진 결과를 한눈에 보여줍니다. 게이지·추이는 데스크탑(md 이상)에서 2열로, 모바일에서 1열로 쌓입니다.',
      },
    },
  },
} satisfies Meta<typeof RecentCheckupSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    patientName: data.patientName,
    overview,
    gaugeMetrics: toGaugeMetrics(overview, data.references),
    trendMetrics: toTrendMetrics(data),
  },
};

export const NoMetrics: Story = {
  args: {
    patientName: data.patientName,
    overview,
    gaugeMetrics: [],
    trendMetrics: [],
  },
  parameters: {
    docs: {
      description: {
        story: '참고치를 파싱할 수 있는 항목이 하나도 없으면 요약 정보만 보여줍니다.',
      },
    },
  },
};
