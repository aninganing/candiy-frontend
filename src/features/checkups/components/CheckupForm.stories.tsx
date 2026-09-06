import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckupForm } from './CheckupForm';

const meta = {
  title: 'features/checkups/CheckupForm',
  component: CheckupForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드의 개인정보 입력 화면입니다. 이름/생년월일/휴대폰번호가 채워지고 형식이 맞아야 제출 버튼이 활성화됩니다. startDate/endDate는 CANDiY API 기본값(1년전~올해)을 그대로 사용해 폼에 노출하지 않습니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <CheckupForm {...args} />
    </div>
  ),
} satisfies Meta<typeof CheckupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: () => {} },
};

export const Submitting: Story = {
  args: { onSubmit: () => {}, isSubmitting: true },
  parameters: {
    docs: { description: { story: '1차 요청 응답을 기다리는 동안의 상태입니다.' } },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: () => {},
    errorMessage: '해당하는 사용자가 없어 본인인증에 실패했습니다. 요청정보를 다시 한번 확인해주세요.',
  },
  parameters: {
    docs: { description: { story: '1차 요청 실패(AE-001 등) 시 표시되는 에러 배너입니다.' } },
  },
};
