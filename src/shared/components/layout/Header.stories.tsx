import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/shared/components/ui/Button';
import { Header } from './Header';

const meta = {
  title: 'layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'CANDiY 로고+타이틀 바입니다. `title`은 있을 때만 부제로 표시하고(예: "건강검진 조회"), `actions`로 우측 영역에 버튼 등을 자유롭게 넣을 수 있습니다.',
      },
    },
  },
  argTypes: {
    actions: { control: false },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: { description: { story: 'title 없이 로고만 있는 기본 형태입니다.' } },
  },
};

export const WithTitle: Story = {
  args: { title: '건강검진 조회' },
  parameters: {
    docs: {
      description: {
        story: 'title을 지정하면 로고 옆에 현재 화면을 나타내는 부제로 표시됩니다.',
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    title: '건강검진 조회',
    actions: <Button variant="ghost-outline">로그아웃</Button>,
  },
  parameters: {
    docs: {
      description: { story: 'actions로 우측 영역에 버튼 등을 넣을 수 있습니다.' },
    },
  },
};
