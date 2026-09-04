import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';

const meta = {
  title: 'ui/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '흰 배경 컨테이너(surface + border + radius-card + shadow-card)입니다. 색상 variant는 없고 `padding`과 `interactive`(클릭 가능한 카드)만 제공합니다.',
      },
    },
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '내부 여백 (sm: 16px, md: 24px, lg: 32px)',
    },
    interactive: {
      control: 'boolean',
      description: '클릭 가능한 카드인지 여부 — hover 시 테두리가 짙어지고 커서가 pointer로 바뀝니다.',
    },
  },
  args: {
    children: '카드 내용',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      본인 확인을 위해 정보를 입력해주세요.
    </Card>
  ),
};

export const Padding: Story = {
  parameters: {
    docs: { description: { story: '3단계 padding을 나란히 비교합니다.' } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Card padding="sm" style={{ width: 160 }}>
        sm (16px)
      </Card>
      <Card padding="md" style={{ width: 160 }}>
        md (24px)
      </Card>
      <Card padding="lg" style={{ width: 160 }}>
        lg (32px)
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  args: { interactive: true },
  parameters: {
    docs: {
      description: {
        story: '클릭 가능한 카드 — hover 시 테두리가 짙어집니다(다크모드에서는 box-shadow 대신 border로 구분).',
      },
    },
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 280 }}>
      최근 검진 결과 보기
    </Card>
  ),
};
