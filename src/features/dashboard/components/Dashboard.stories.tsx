import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IsRestoringProvider, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { queryKeys } from '@/shared/api/queryKeys';
import { Dashboard } from './Dashboard';

const meta = {
  title: 'features/dashboard/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '건강검진 조회 위저드 완료 후 이동하는 고정 경로(/dashboard)입니다. 여러 검진일 중 가장 최근 것을 기본으로 보여주며, 데이터는 본인인증 플로우에서만 채워지는 TanStack Query 캐시(queryKeys.checkups.data())에서 읽습니다. 캐시는 sessionStorage에 동기화되어 새로고침/뒤로가기에도 유지되고 탭을 닫으면 사라지며, 복원 중에는 스피너를, 캐시가 비어 있으면 안내 문구를 보여줍니다.',
      },
    },
  },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      queryClient.setQueryData(queryKeys.checkups.data(), toCheckupData(checkupDataFixture));
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export const NoCachedData: Story = {
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
        story:
          '아직 본인인증을 거치지 않았거나, 탭을 닫았다 새로 열어 캐시가 비어 있는 경우입니다.',
      },
    },
  },
};

export const Restoring: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <IsRestoringProvider value={true}>
          <Story />
        </IsRestoringProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'sessionStorage에서 캐시를 복원하는 짧은 순간의 모습입니다 — 빈 상태로 깜빡이지 않게 스피너를 보여줍니다.',
      },
    },
  },
};
