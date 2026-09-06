import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BarComparisonChart } from './BarComparisonChart';

const meta = {
  title: 'charts/BarComparisonChart',
  component: BarComparisonChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '서로 단위가 다른 지표(mg/dL 등)를 각자의 질환의심 기준(=100%) 대비 비율로 환산해 연도별로 비교하는 그룹 바 차트입니다. 기준선(기본 100%)은 점선으로 표시하고, max를 넘어 막대가 잘리더라도 실제 값은 막대 위 라벨로 그대로 보여줍니다. 기준선 라벨 텍스트는 thresholdLabel prop으로 받으며(생략 시 점선만 표시), series 색상은 기본 팔레트 없이 seriesColors로 항상 직접 지정합니다 — series와 seriesColors의 개수가 다르면 에러를 던집니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <BarComparisonChart {...args} />
    </div>
  ),
} satisfies Meta<typeof BarComparisonChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: ["'22", "'23", "'24"],
    series: [
      { label: '총콜레스테롤(%)', values: [82.5, 85.4, 102.1] },
      { label: 'LDL콜레스테롤(%)', values: [62.5, 65, 86.3] },
      { label: '중성지방(%)', values: [60, 67.5, 84] },
    ],
    seriesColors: ['#4f46e5', '#0d9488', '#c026d3'],
  },
};

export const ExceedsMax: Story = {
  args: {
    categories: ["'22", "'23", "'24"],
    series: [
      { label: '총콜레스테롤(%)', values: [82.5, 85.4, 102.1] },
      { label: 'LDL콜레스테롤(%)', values: [62.5, 65, 145] },
    ],
    seriesColors: ['#4f46e5', '#0d9488'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'max(기본 120)를 넘는 값은 막대가 상단에서 잘리지만, 라벨은 실제 값(145)을 그대로 보여줍니다.',
      },
    },
  },
};

export const TwoSeries: Story = {
  args: {
    categories: ["'23", "'24"],
    series: [
      { label: '수축기 혈압(%)', values: [95, 110] },
      { label: '이완기 혈압(%)', values: [88, 96] },
    ],
    seriesColors: ['#4f46e5', '#0d9488'],
  },
};

export const FiveSeries: Story = {
  args: {
    categories: ["'22", "'23", "'24"],
    series: [
      { label: '총콜레스테롤(%)', values: [82.5, 85.4, 102.1] },
      { label: 'LDL콜레스테롤(%)', values: [62.5, 65, 86.3] },
      { label: '중성지방(%)', values: [60, 67.5, 84] },
      { label: '공복혈당(%)', values: [70, 78, 92] },
      { label: '허리둘레(%)', values: [88, 94, 101] },
    ],
    seriesColors: ['#4f46e5', '#0d9488', '#c026d3', '#f59e0b', '#0284c7'],
  },
  parameters: {
    docs: {
      description: {
        story: 'series 개수가 몇 개든 seriesColors를 그만큼 넘겨 색상을 직접 제어합니다.',
      },
    },
  },
};

export const WithThresholdLabel: Story = {
  args: {
    categories: ["'22", "'23", "'24"],
    series: [
      { label: '총콜레스테롤(%)', values: [82.5, 85.4, 102.1] },
      { label: 'LDL콜레스테롤(%)', values: [62.5, 65, 86.3] },
      { label: '중성지방(%)', values: [60, 67.5, 84] },
    ],
    seriesColors: ['#4f46e5', '#0d9488', '#c026d3'],
    thresholdLabel: '100% = 질환의심 기준',
  },
  parameters: {
    docs: {
      description: {
        story:
          'thresholdLabel을 넘기면 기준선 옆에 텍스트가 표시됩니다. 생략하면 다른 스토리들처럼 점선만 그려집니다.',
      },
    },
  },
};
