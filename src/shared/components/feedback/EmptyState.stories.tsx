import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileX2 } from 'lucide-react';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'shared/feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '데이터가 없을 때 보여주는 공용 컴포넌트입니다. icon은 생략하면 기본 아이콘을 쓰고, action에 재시도 버튼이나 링크를 넣을 수 있습니다.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '조회된 검진 데이터가 없습니다',
    description: '본인인증이 필요한 데이터라 새로고침하면 사라집니다.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <FileX2 size={32} />,
    title: '조회된 검진 데이터가 없습니다',
    description: '본인인증이 필요한 데이터라 새로고침하면 사라집니다. 건강검진 조회를 다시 진행해주세요.',
    action: (
      <a href="#" className="text-primary text-sm font-semibold hover:underline">
        건강검진 조회로 돌아가기
      </a>
    ),
  },
};
