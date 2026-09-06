import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InlineAlert } from './InlineAlert';

const meta = {
  title: 'ui/InlineAlert',
  component: InlineAlert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '아이콘 + 틴트 배경 + 텍스트로 구성된 인라인 배너입니다. tone별 기본 아이콘이 있어 icon 없이도 바로 쓸 수 있고, 필요하면 icon으로 오버라이드할 수 있습니다.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['danger', 'warning', 'success'],
    },
    icon: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <InlineAlert {...args} />
    </div>
  ),
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    tone: 'danger',
    children: '해당하는 사용자가 없어 본인인증에 실패했습니다. 요청정보를 다시 한번 확인해주세요.',
  },
  parameters: {
    docs: { description: { story: '개인정보 입력 폼의 인증 실패 에러 배너입니다.' } },
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    children: '아직 인증이 완료되지 않았습니다. 휴대폰에서 인증을 완료한 후 다시 눌러주세요.',
  },
  parameters: {
    docs: { description: { story: '인증 대기 화면에서 재시도가 필요할 때 보여주는 배너입니다.' } },
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    children: '홍길동님의 건강검진 조회가 완료되었습니다.',
  },
};

export const AllTones: Story = {
  parameters: {
    docs: { description: { story: '3가지 tone을 한눈에 비교합니다.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
      <InlineAlert tone="danger">danger — 실패, 되돌릴 수 없는 문제</InlineAlert>
      <InlineAlert tone="warning">warning — 재시도 가능한 주의</InlineAlert>
      <InlineAlert tone="success">success — 완료, 정상</InlineAlert>
    </div>
  ),
};
