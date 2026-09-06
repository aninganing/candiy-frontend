import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckupDetail } from './CheckupDetail';

const meta = {
  title: 'features/checkups/CheckupDetail',
  component: CheckupDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드 완료 후 이동하는 상세 화면입니다. 현재는 라우팅/네비게이션 틀만 있고, 검진 개요·상세 항목·과거 이력 표시는 이후 마일스톤에서 구현됩니다.',
      },
    },
  },
} satisfies Meta<typeof CheckupDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: '2024-05-10' },
};
