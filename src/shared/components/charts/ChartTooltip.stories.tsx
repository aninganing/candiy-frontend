import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChartTooltip } from './ChartTooltip';

const meta = {
  title: 'charts/ChartTooltip',
  component: ChartTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Chart.js의 external tooltip 콜백과 함께 쓰는 커스텀 툴팁입니다. 차트 캔버스를 감싼 `position:relative` 컨테이너를 기준으로 x/y 픽셀 좌표에 위치합니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', width: 200, height: 120, paddingTop: 60 }}>
      <ChartTooltip {...args} />
    </div>
  ),
} satisfies Meta<typeof ChartTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { x: 100, y: 60, label: "'24", value: '245 mg/dL', visible: true },
};

export const Hidden: Story = {
  args: { x: 100, y: 60, label: "'24", value: '245 mg/dL', visible: false },
  parameters: {
    docs: { description: { story: 'visible이 false면 아무것도 렌더링하지 않습니다.' } },
  },
};
