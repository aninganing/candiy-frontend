import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { PatientSummaryCard } from './PatientSummaryCard';

const overview = toCheckupData(checkupDataFixture).overviews[0];

const meta = {
  title: 'features/dashboard/PatientSummaryCard',
  component: PatientSummaryCard,
  tags: ['autodocs'],
  args: {
    patientName: '홍길동',
    overview,
  },
} satisfies Meta<typeof PatientSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
