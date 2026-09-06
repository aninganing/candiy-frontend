import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GaugeRangeChart } from './GaugeRangeChart';

const meta = {
  title: 'charts/GaugeRangeChart',
  component: GaugeRangeChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '검진 항목의 현재 값이 참고치 범위 안에서 어디에 있는지 보여주는 인라인 range 게이지입니다. `min`~`max` 스케일 안에서 `value`만큼 막대가 채워지고, `boundary`(질환의심 기준) 위치에 세로 마커가 표시됩니다. 색상은 `status`(정상/주의/위험)를 따릅니다.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['normal', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg'],
    },
    animate: {
      control: 'boolean',
    },
  },
  render: (args) => (
    <div style={{ width: args.size ? undefined : 240 }}>
      <GaugeRangeChart {...args} />
    </div>
  ),
} satisfies Meta<typeof GaugeRangeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: { value: 23.5, min: 15, max: 32, boundary: 24.9, status: 'normal' },
  parameters: {
    docs: { description: { story: 'BMI 23.5 — 참고치 상한(24.9) 안쪽으로, 정상 범위입니다.' } },
  },
};

export const Warning: Story = {
  args: { value: 108, min: 60, max: 140, boundary: 100, status: 'warning' },
  parameters: {
    docs: {
      description: {
        story: '공복혈당 108 — 정상 상한(100)을 넘었지만 질환의심 기준(126) 전 단계입니다.',
      },
    },
  },
};

export const Danger: Story = {
  args: { value: 245, min: 100, max: 280, boundary: 200, status: 'danger' },
  parameters: {
    docs: { description: { story: '총콜레스테롤 245 — 질환의심 기준(200)을 크게 초과했습니다.' } },
  },
};

export const Animated: Story = {
  args: { value: 245, min: 100, max: 280, boundary: 200, status: 'danger', animate: true },
  parameters: {
    docs: {
      description: {
        story: 'animate를 true로 주면 min에서 value까지 채워지는 애니메이션이 재생됩니다.',
      },
    },
  },
};

export const Sizes: Story = {
  args: { value: 108, min: 60, max: 140, boundary: 100, status: 'warning' },
  parameters: {
    docs: {
      description: {
        story: 'size를 지정하면 부모 너비와 무관하게 고정 너비(sm/md/lg)로 표시됩니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <GaugeRangeChart {...args} size="sm" />
      <GaugeRangeChart {...args} size="md" />
      <GaugeRangeChart {...args} size="lg" />
    </div>
  ),
};
