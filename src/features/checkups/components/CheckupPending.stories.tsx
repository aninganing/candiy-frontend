import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckupPending } from './CheckupPending';

const meta = {
  title: 'features/checkups/CheckupPending',
  component: CheckupPending,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드의 인증 대기 화면입니다. 4분 30초 카운트다운을 보여주고, "인증 완료" 버튼을 누르면 onConfirm이 호출됩니다. 실패(AE-003 등)하면 같은 화면에서 warning 배너와 함께 재시도할 수 있습니다.',
      },
    },
  },
  args: {
    legalName: '홍길동',
    loginTypeLevel: 1,
  },
} satisfies Meta<typeof CheckupPending>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onConfirm: () => {}, onCancel: () => {} },
};

export const Verifying: Story = {
  args: { onConfirm: () => {}, onCancel: () => {}, isVerifying: true },
  parameters: {
    docs: { description: { story: '2차 요청 응답을 기다리는 동안의 상태입니다.' } },
  },
};

export const RetryWarning: Story = {
  args: {
    onConfirm: () => {},
    onCancel: () => {},
    errorMessage: '아직 인증이 완료되지 않았습니다. 휴대폰에서 인증을 완료한 후 다시 눌러주세요.',
  },
  parameters: {
    docs: {
      description: { story: '인증을 아직 완료하지 않은 상태로 버튼을 눌렀을 때(AE-003)의 재시도 안내입니다.' },
    },
  },
};
