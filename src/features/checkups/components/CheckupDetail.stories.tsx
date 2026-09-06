import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { queryKeys } from '@/shared/api/queryKeys';
import { CheckupDetail } from './CheckupDetail';

const meta = {
  title: 'features/checkups/CheckupDetail',
  component: CheckupDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드 완료 후 이동하는 상세 화면입니다. 데이터는 본인인증 플로우에서만 채워지는 TanStack Query 캐시(queryKeys.checkups.detail())에서 읽으며, 캐시가 비어 있으면(새로고침 등) 안내 문구를 보여줍니다. 검진 개요·상세 항목·과거 이력 표시는 이후 마일스톤에서 구현됩니다.',
      },
    },
  },
} satisfies Meta<typeof CheckupDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: '2024-05-10' },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      queryClient.setQueryData(queryKeys.checkups.detail(), toCheckupData(checkupDataFixture));
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export const NoCachedData: Story = {
  args: { id: '2024-05-10' },
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '본인인증 없이 이 화면에 직접 진입하거나 새로고침해 캐시가 비어 있는 경우입니다.',
      },
    },
  },
};
