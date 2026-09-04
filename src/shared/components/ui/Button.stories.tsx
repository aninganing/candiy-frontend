import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const VARIANTS = [
  'primary',
  'primary-outline',
  'ghost',
  'ghost-outline',
  'success',
  'success-outline',
  'warning',
  'warning-outline',
  'danger',
  'danger-outline',
] as const;

const meta = {
  title: 'ui/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'CANDiY 건강검진 대시보드의 기본 버튼입니다. 색상 계열(primary/ghost/success/warning/danger)마다 채워진(solid) 버전과 테두리만 있는(outline) 버전을 짝으로 제공합니다. `size`로 크기를, `fullWidth`/`icon`으로 레이아웃을 조정합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'primary(주 액션) · ghost(중립 보조 액션) · success/warning/danger(상태 강조 액션). 각각 `-outline`을 붙이면 테두리만 있는 버전입니다.',
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
      description: '버튼 크기',
    },
    fullWidth: {
      control: 'boolean',
      description: '너비를 부모 요소에 꽉 채울지 여부',
    },
    icon: {
      control: false,
      description: '함께 표시할 아이콘(ReactNode)',
    },
    iconPosition: {
      control: 'select',
      options: ['leading', 'trailing'],
      description: 'icon을 텍스트 앞(leading)/뒤(trailing) 중 어디에 배치할지',
    },
  },
  args: {
    children: '건강검진 조회 시작',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 solid/outline 쌍으로 비교합니다.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['primary', 'ghost', 'success', 'warning', 'danger'] as const).map((base) => (
        <div key={base} style={{ display: 'flex', gap: 8 }}>
          <Button variant={base}>{base}</Button>
          <Button variant={`${base}-outline` as const}>{base}-outline</Button>
        </div>
      ))}
    </div>
  ),
};

export const Primary: Story = {
  args: { variant: 'primary' },
  parameters: {
    docs: { description: { story: '폼 제출, 조회 시작 등 주요 액션에 사용하는 기본 버튼입니다.' } },
  },
};

export const PrimaryOutline: Story = {
  args: { variant: 'primary-outline', children: '더 알아보기' },
  parameters: {
    docs: {
      description: { story: '주요 액션이지만 시각적 무게는 덜 필요할 때 사용합니다.' },
    },
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: '취소' },
  parameters: {
    docs: {
      description: {
        story: '연한 회색 배경의 중립 보조 액션 버튼입니다. hover 시 더 진한 회색으로 바뀝니다.',
      },
    },
  },
};

export const GhostOutline: Story = {
  args: { variant: 'ghost-outline', children: '다시 조회하기' },
  parameters: {
    docs: { description: { story: '테두리만 있는 중립 버튼입니다. hover 시 옅은 배경이 채워집니다.' } },
  },
};

export const Success: Story = {
  args: { variant: 'success', children: '정상' },
  parameters: {
    docs: { description: { story: '정상/성공 상태를 강조하는 액션에 사용합니다.' } },
  },
};

export const SuccessOutline: Story = {
  args: { variant: 'success-outline', children: '정상' },
  parameters: {
    docs: {
      description: { story: '정상/성공 상태를 약하게 강조할 때 사용하는 테두리 버전입니다.' },
    },
  },
};

export const Warning: Story = {
  args: { variant: 'warning', children: '주의' },
  parameters: {
    docs: { description: { story: '주의가 필요한 상태를 강조하는 액션에 사용합니다.' } },
  },
};

export const WarningOutline: Story = {
  args: { variant: 'warning-outline', children: '주의' },
  parameters: {
    docs: {
      description: { story: '주의가 필요한 상태를 약하게 강조할 때 사용하는 테두리 버전입니다.' },
    },
  },
};

export const Danger: Story = {
  args: { variant: 'danger', children: '조회 취소' },
  parameters: {
    docs: { description: { story: '되돌릴 수 없거나 파괴적인 액션에 사용합니다.' } },
  },
};

export const DangerOutline: Story = {
  args: { variant: 'danger-outline', children: '조회 취소' },
  parameters: {
    docs: {
      description: {
        story: '파괴적인 액션이지만 시각적 무게는 덜 필요할 때 사용하는 테두리 버전입니다.',
      },
    },
  },
};

export const Large: Story = {
  args: { size: 'lg' },
  parameters: {
    docs: {
      description: { story: '큰 사이즈 — 위저드의 주요 CTA처럼 강조가 필요할 때 사용합니다.' },
    },
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: {
    layout: 'padded',
    docs: { description: { story: '부모 너비에 꽉 채웁니다. 폼/카드 하단 CTA에 주로 사용합니다.' } },
  },
};

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 12.2l2.4 2.4 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WithIcon: Story = {
  args: { icon: CHECK_ICON },
  parameters: {
    docs: { description: { story: '아이콘을 텍스트 앞(leading, 기본값)에 함께 표시할 때 사용합니다.' } },
  },
};

export const WithTrailingIcon: Story = {
  args: { icon: ARROW_ICON, iconPosition: 'trailing', children: '다음 단계로' },
  parameters: {
    docs: { description: { story: '아이콘을 텍스트 뒤(trailing)에 표시합니다. "다음" 같은 진행 액션에 어울립니다.' } },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: { description: { story: '비활성 상태 — 클릭할 수 없고 흐릿하게 표시됩니다.' } },
  },
};
