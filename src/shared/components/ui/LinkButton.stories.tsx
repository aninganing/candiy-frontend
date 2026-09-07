import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinkButton } from './LinkButton';

const meta = {
  title: 'ui/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button과 같은 variant/size 스타일을 쓰지만 실제로는 페이지 이동(next/link)인 CTA에 사용합니다. onClick 핸들러가 필요한 액션은 Button을 사용하세요.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
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
      ],
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  args: {
    href: '/checkups',
    children: '시작하기',
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'lg' },
};

export const GhostOutline: Story = {
  args: { variant: 'ghost-outline', children: '더 알아보기' },
};
