export interface ChartTooltipProps {
  x: number;
  y: number;
  label: string;
  value: string;
  visible: boolean;
}

// Chart.js의 external tooltip 콜백과 함께 쓰는 커스텀 툴팁. x/y는 차트 캔버스를 감싼
// position:relative 컨테이너 기준 픽셀 좌표(tooltipModel.caretX/caretY)를 그대로 받는다.
export function ChartTooltip({ x, y, label, value, visible }: ChartTooltipProps) {
  if (!visible) return null;

  return (
    <div
      role="tooltip"
      className="bg-surface border-border shadow-card pointer-events-none absolute z-50 flex items-center gap-1.5 rounded-control border px-2.5 py-1.5 text-xs whitespace-nowrap"
      style={{ left: x, top: y, transform: 'translate(-50%, calc(-100% - 8px))' }}
    >
      <span className="text-foreground-subtle">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  );
}
