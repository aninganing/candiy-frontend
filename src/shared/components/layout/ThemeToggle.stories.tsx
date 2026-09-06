import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'layout/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '다크/라이트 모드를 전환하는 버튼입니다. 선택한 값은 localStorage에 저장되고 문서 루트의 data-theme 속성에 반영됩니다. 아이콘은 현재 모드(해=라이트, 달=다크)를 나타냅니다.',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
