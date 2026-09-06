import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Calendar, User } from 'lucide-react';
import { Input } from './Input';

const USER_ICON = <User size={16} />;

const CALENDAR_ICON = <Calendar size={16} />;

const meta = {
  title: 'ui/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '텍스트 인풋입니다. `label`은 있을 때만 렌더링되고, `icon`을 `leading`/`trailing`으로 배치할 수 있으며, `errorText`가 있으면 `helperText` 대신 danger 톤으로 표시됩니다.',
      },
    },
  },
  argTypes: {
    icon: { control: false },
    iconPosition: {
      control: 'select',
      options: ['leading', 'trailing'],
      description: 'icon을 입력창 앞(leading)/뒤(trailing) 중 어디에 배치할지',
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'label과 입력창을 세로(vertical, 기본값)/가로(horizontal)로 배치할지',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: '이름', placeholder: '홍길동' },
};

export const WithHelperText: Story = {
  args: { label: '생년월일', placeholder: '19900101', helperText: 'YYYYMMDD 형식' },
  parameters: {
    docs: { description: { story: '입력 형식 안내처럼 항상 보여줄 문구는 helperText를 씁니다.' } },
  },
};

export const WithError: Story = {
  args: {
    label: '휴대폰번호',
    defaultValue: '010-1234-5678',
    errorText: '11자리의 숫자로 입력해주세요.',
  },
  parameters: {
    docs: {
      description: {
        story: 'errorText가 있으면 helperText 대신 표시되고, 테두리/문구가 danger 톤으로 바뀝니다.',
      },
    },
  },
};

export const WithLeadingIcon: Story = {
  args: { label: '이름', placeholder: '홍길동', icon: USER_ICON },
};

export const WithTrailingIcon: Story = {
  args: {
    label: '조회 종료 연도',
    placeholder: '2024',
    icon: CALENDAR_ICON,
    iconPosition: 'trailing',
  },
};

export const Disabled: Story = {
  args: { label: '이름', defaultValue: '홍길동', disabled: true },
};

export const HorizontalLayout: Story = {
  args: { label: '이름', placeholder: '홍길동', layout: 'horizontal' },
  parameters: {
    docs: {
      description: { story: 'label과 입력창을 한 줄에 나란히 배치합니다.' },
    },
  },
};
