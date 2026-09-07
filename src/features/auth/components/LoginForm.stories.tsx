import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'features/auth/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '이름은 자유 입력, 비밀번호는 영문+숫자 조합 8자 이상 형식만 검증하는 목업 로그인 폼입니다. 별도의 계정 시스템 없이 통과하면 입력한 이름으로 로그인 처리됩니다.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <LoginForm />
    </div>
  ),
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
