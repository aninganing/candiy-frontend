import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SelectableChip } from './SelectableChip';

const meta = {
  title: 'ui/SelectableChip',
  component: SelectableChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '선택 가능한 pill 버튼입니다. `role="radio"`(기본값)는 여러 옵션 중 하나만 고르는 그룹(간편인증 수단, 통신사)에 쓰고 aria-checked로 상태를 노출하며, 부모에 role="radiogroup"을 함께 둡니다. 독립적인 on/off 토글이 필요하면 `role="button"`으로 바꿔 aria-pressed를 씁니다.',
      },
    },
  },
  argTypes: {
    selected: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    role: {
      control: 'select',
      options: ['radio', 'button'],
      description: 'radio(기본값, 단일 선택 그룹) · button(독립 토글)',
    },
    icon: { control: false },
  },
  args: {
    children: '카카오톡',
  },
} satisfies Meta<typeof SelectableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { selected: false },
};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: '3단계 크기(sm/md/lg)를 비교합니다.' } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <SelectableChip size="sm">sm</SelectableChip>
      <SelectableChip size="md">md</SelectableChip>
      <SelectableChip size="lg">lg</SelectableChip>
    </div>
  ),
};

const AUTH_METHODS = [
  '카카오톡',
  '삼성패스',
  '국민은행',
  'PASS',
  '네이버',
  '신한은행',
  '토스',
  '뱅크샐러드',
  '하나은행',
  'NH모바일인증서',
  '우리은행',
  '카카오뱅크',
];

export const AuthMethodGrid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '간편인증 수단 12개를 4열 그리드로 배치하고, 하나만 선택 가능하게 구성한 예시입니다.',
      },
    },
  },
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState('카카오톡');
      return (
        <div
          role="radiogroup"
          aria-label="간편인증 수단 선택"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 8,
            maxWidth: 480,
          }}
        >
          {AUTH_METHODS.map((method) => (
            <SelectableChip
              key={method}
              size="sm"
              selected={selected === method}
              onClick={() => setSelected(method)}
            >
              {method}
            </SelectableChip>
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};

const TELECOMS = ['SKT', 'KT', 'LG U+'];

export const TelecomSegment: Story = {
  parameters: {
    docs: {
      description: { story: '통신사 3개를 세그먼트 형태로 배치한 예시입니다.' },
    },
  },
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState('SKT');
      return (
        <div
          role="radiogroup"
          aria-label="통신사 선택"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 320 }}
        >
          {TELECOMS.map((telecom) => (
            <SelectableChip
              key={telecom}
              selected={selected === telecom}
              onClick={() => setSelected(telecom)}
            >
              {telecom}
            </SelectableChip>
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};

const CHECKUP_TYPES = ['일반검진', '암검진', '구강검진'];

export const MultiSelectToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'role="button"은 각 칩이 독립적인 on/off 토글이라 여러 개를 동시에 선택할 수 있습니다. radio(기본값)와 달리 부모에 radiogroup을 두지 않습니다.',
      },
    },
  },
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string[]>(['일반검진']);
      const toggle = (type: string) =>
        setSelected((prev) =>
          prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        );
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          {CHECKUP_TYPES.map((type) => (
            <SelectableChip
              key={type}
              role="button"
              selected={selected.includes(type)}
              onClick={() => toggle(type)}
            >
              {type}
            </SelectableChip>
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};
