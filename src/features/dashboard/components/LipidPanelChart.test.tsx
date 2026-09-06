import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toLipidPanel } from '@/features/dashboard/mappers/lipidPanel.mapper';
import { LipidPanelChart } from './LipidPanelChart';

const data = toLipidPanel(toCheckupData(checkupDataFixture));

describe('LipidPanelChart', () => {
  it('제목과 지질 항목 라벨을 표시한다', () => {
    render(<LipidPanelChart data={data} />);

    expect(screen.getByText('지질 패널 비교')).toBeInTheDocument();
    expect(screen.getByText('총콜레스테롤(%)')).toBeInTheDocument();
    expect(screen.getByText('LDL콜레스테롤(%)')).toBeInTheDocument();
    expect(screen.getByText('중성지방(%)')).toBeInTheDocument();
  });

  it('데이터가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<LipidPanelChart data={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
