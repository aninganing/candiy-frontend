import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { CheckupSuccess } from './CheckupSuccess';

const meta = {
  title: 'features/checkups/CheckupSuccess',
  component: CheckupSuccess,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드의 마지막 화면입니다. 조회된 검진 건수와 최근 검진일을 요약해서 보여주고, "확인"/"다시 조회하기" 버튼을 제공합니다.',
      },
    },
  },
  args: {
    data: toCheckupData(checkupDataFixture),
    onConfirm: () => {},
    onReset: () => {},
  },
} satisfies Meta<typeof CheckupSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
