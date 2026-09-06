import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LineTrendChart } from './LineTrendChart';

const meta = {
  title: 'charts/LineTrendChart',
  component: LineTrendChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '연도별 검진 수치 추이를 보여주는 소형 라인차트입니다. 참고치가 상/하한 range(`kind: "band"`)면 배경 밴드 + 같은 색 점선 경계를, 한쪽 기준(`kind: "line"`)뿐이면 중립색 점선 기준선 하나를 그립니다. y축엔 참고치 값(band면 상/하한 두 개, line이면 기준값 하나)만 눈금으로 표시하고, 각 연도의 실제 데이터 값은 점에 마우스를 올리면 `ChartTooltip`으로 보여줍니다.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['normal', 'warning', 'danger'],
    },
  },
  render: (args) => (
    <div style={{ width: 180 }}>
      <LineTrendChart {...args} />
    </div>
  ),
} satisfies Meta<typeof LineTrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BandReference: Story = {
  args: {
    values: [24.6, 24.1, 23.5],
    categories: ["'22", "'23", "'24"],
    status: 'normal',
    reference: { kind: 'band', low: 18.5, high: 24.9 },
  },
  parameters: {
    docs: {
      description: {
        story: 'BMI 추이 — 정상 범위(18.5–24.9)가 상/하한 둘 다 있어 배경 밴드로 표시합니다.',
      },
    },
  },
};

export const LineReferenceWarning: Story = {
  args: {
    values: [118, 124, 132],
    categories: ["'22", "'23", "'24"],
    status: 'warning',
    reference: { kind: 'line', boundary: 120 },
  },
  parameters: {
    docs: {
      description: {
        story: '수축기 혈압 추이 — 정상 상한(120)만 있어 점선 기준선 하나로 표시합니다.',
      },
    },
  },
};

export const LineReferenceDanger: Story = {
  args: {
    values: [198, 205, 245],
    categories: ["'22", "'23", "'24"],
    status: 'danger',
    reference: { kind: 'line', boundary: 200 },
  },
  parameters: {
    docs: {
      description: { story: '총콜레스테롤 추이 — 기준(200)을 최근 크게 초과했습니다.' },
    },
  },
};

export const FourColumns: Story = {
  args: {
    values: [24.6, 24.1, 23.5],
    categories: ["'22", "'23", "'24"],
    status: 'normal',
    reference: { kind: 'band', low: 18.5, high: 24.9 },
  },
  parameters: {
    docs: { description: { story: '실제 화면(핵심 지표 추이)처럼 4열로 나란히 배치했을 때의 모습입니다.' } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      <LineTrendChart
        values={[24.6, 24.1, 23.5]}
        categories={["'22", "'23", "'24"]}
        status="normal"
        reference={{ kind: 'band', low: 18.5, high: 24.9 }}
      />
      <LineTrendChart
        values={[118, 124, 132]}
        categories={["'22", "'23", "'24"]}
        status="warning"
        reference={{ kind: 'line', boundary: 120 }}
      />
      <LineTrendChart
        values={[74, 80, 86]}
        categories={["'22", "'23", "'24"]}
        status="warning"
        reference={{ kind: 'line', boundary: 80 }}
      />
      <LineTrendChart
        values={[198, 205, 245]}
        categories={["'22", "'23", "'24"]}
        status="danger"
        reference={{ kind: 'line', boundary: 200 }}
      />
    </div>
  ),
};
