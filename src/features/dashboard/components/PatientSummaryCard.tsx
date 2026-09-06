import { Card } from '@/shared/components/ui/Card';
import type { CheckupOverview } from '@/features/checkups/types/checkup.types';

export interface PatientSummaryCardProps {
  patientName: string;
  overview: CheckupOverview;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-foreground-subtle text-xs">{label}</span>
      <span className="text-foreground text-sm font-semibold">{value}</span>
    </div>
  );
}

export function PatientSummaryCard({ patientName, overview }: PatientSummaryCardProps) {
  return (
    <Card padding="lg" className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-foreground text-lg font-bold tracking-tight">{patientName}님</h1>
        <span className="text-foreground-subtle text-xs">{overview.checkupDate} 검진</span>
      </div>
      <p className="text-foreground-muted text-sm leading-relaxed">{overview.evaluation}</p>
      <div className="border-border grid grid-cols-2 gap-4 border-t pt-4">
        <Stat label="BMI" value={overview.bmi} />
        <Stat label="혈압" value={overview.bloodPressure} />
      </div>
    </Card>
  );
}
