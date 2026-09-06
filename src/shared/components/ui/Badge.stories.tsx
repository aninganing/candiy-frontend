import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CircleCheck, Clock } from 'lucide-react';
import { Badge } from './Badge';

const meta = {
  title: 'ui/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '아이콘이나 텍스트를 담는 뱃지입니다. `shape="circle"`은 원형 아이콘 뱃지(인증 대기/완료 화면의 중앙 아이콘), `shape="pill"`(기본값)은 텍스트/상태 표시용 캡슐 뱃지입니다. circle은 기본적으로 자식 svg 크기를 size에 맞춰 자동 조정합니다(`autoSizeIcon={false}`로 끌 수 있음 — 직접 크기를 지정하고 싶을 때 사용).',
      },
    },
  },
  argTypes: {
    shape: {
      control: 'select',
      options: ['pill', 'circle'],
      description: 'pill(캡슐, 기본값) · circle(원형, 아이콘 위주)',
    },
    tone: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    autoSizeIcon: {
      control: 'boolean',
      description:
        'circle 뱃지에서 자식 svg 크기를 size에 맞춰 자동 조정할지 여부(기본값 true). false로 두면 아이콘에 직접 크기를 지정할 수 있습니다.',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PillTones: Story = {
  parameters: {
    docs: { description: { story: 'pill 뱃지의 5가지 tone을 비교합니다.' } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="primary">primary</Badge>
      <Badge tone="success">정상</Badge>
      <Badge tone="warning">주의</Badge>
      <Badge tone="danger">위험</Badge>
      <Badge tone="neutral">neutral</Badge>
    </div>
  ),
};

export const PillWithIcon: Story = {
  args: {
    tone: 'success',
    children: (
      <>
        <CircleCheck size={16} />
        정상
      </>
    ),
  },
  parameters: {
    docs: { description: { story: '아이콘과 텍스트를 함께 넣을 수 있습니다.' } },
  },
};

export const CirclePrimary: Story = {
  args: { shape: 'circle', tone: 'primary', size: 'lg', children: <Clock /> },
  parameters: {
    docs: {
      description: {
        story: '인증 대기 화면의 중앙 아이콘처럼, 원형 배경 안에 아이콘만 넣을 때 사용합니다.',
      },
    },
  },
};

export const CircleSuccess: Story = {
  args: { shape: 'circle', tone: 'success', size: 'lg', children: <CircleCheck /> },
  parameters: {
    docs: { description: { story: '조회 완료 화면의 성공 아이콘입니다.' } },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'circle 뱃지의 3단계 크기를 비교합니다.' } },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Badge shape="circle" tone="primary" size="sm">
        <CircleCheck />
      </Badge>
      <Badge shape="circle" tone="primary" size="md">
        <CircleCheck />
      </Badge>
      <Badge shape="circle" tone="primary" size="lg">
        <CircleCheck />
      </Badge>
    </div>
  ),
};

export const CustomIconSize: Story = {
  args: {
    shape: 'circle',
    tone: 'primary',
    size: 'lg',
    autoSizeIcon: false,
    children: <Clock size={40} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'autoSizeIcon={false}로 두면 자동 크기 규칙이 꺼져서, svg에 지정한 width/height(또는 className)가 그대로 적용됩니다.',
      },
    },
  },
};
