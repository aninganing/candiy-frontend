import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckupIntro } from './CheckupIntro';

const meta = {
  title: 'features/checkups/CheckupIntro',
  component: CheckupIntro,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '건강검진 조회 위저드의 첫 화면입니다. "건강검진 조회 시작" 버튼을 누르면 onStart가 호출됩니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', minHeight: 480, background: 'var(--background)' }}>
      <CheckupIntro {...args} />
    </div>
  ),
} satisfies Meta<typeof CheckupIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onStart: () => {} },
};
