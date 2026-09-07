import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartTooltip } from './ChartTooltip';

describe('ChartTooltip', () => {
  it('visible이 true면 label과 value를 렌더링한다', () => {
    render(<ChartTooltip x={10} y={20} label="'24" value="245 mg/dL" visible />);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText("'24")).toBeInTheDocument();
    expect(screen.getByText('245 mg/dL')).toBeInTheDocument();
  });

  it('visible이 false면 아무것도 렌더링하지 않는다', () => {
    render(<ChartTooltip x={10} y={20} label="'24" value="245 mg/dL" visible={false} />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('x/y 좌표를 위치 스타일로 반영한다', () => {
    render(<ChartTooltip x={42} y={17} label="'24" value="245" visible />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveStyle({ left: '42px', top: '17px' });
  });
});
