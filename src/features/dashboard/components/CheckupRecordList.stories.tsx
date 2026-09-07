import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { CheckupRecordList } from './CheckupRecordList';

const data = toCheckupData(checkupDataFixture);

const meta = {
  title: 'features/dashboard/CheckupRecordList',
  component: CheckupRecordList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'resultList(검진 방문 기록)의 개수와 각 기록의 검진일·기관명·검진유형을 보여줍니다. overviewList(검진 수치 스냅샷)와 개수가 다를 수 있어 독립적으로 표시합니다.',
      },
    },
  },
} satisfies Meta<typeof CheckupRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { records: data.records },
};

export const OverviewRecordMismatch: Story = {
  args: {
    records: [
      ...data.records,
      {
        caseType: '0',
        checkupType: '종합',
        checkupDate: '2022-03-15',
        organizationName: '강남 검진의원',
        pdfData: '',
        questionnaire: [],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'overviewList는 2건이지만 resultList는 3건인 경우처럼, 개수가 어긋나도 그대로 보여줍니다.',
      },
    },
  },
};
