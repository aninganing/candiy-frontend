import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDragScroll } from './useDragScroll';

function DragScrollHarness({ onItemClick }: { onItemClick: () => void }) {
  const { ref, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClickCapture } =
    useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-testid="scroller"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      <button onClick={onItemClick}>item</button>
    </div>
  );
}

describe('useDragScroll', () => {
  it('포인터를 누르고 움직이면 움직인 만큼 반대 방향으로 scrollLeft를 옮긴다', () => {
    render(<DragScrollHarness onItemClick={vi.fn()} />);
    const scroller = screen.getByTestId('scroller');

    fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(scroller, { clientX: 60, pointerId: 1 });

    expect(scroller.scrollLeft).toBe(40);
  });

  it('임계값 이하로 움직이면 드래그로 보지 않아 클릭이 그대로 동작한다', () => {
    const onItemClick = vi.fn();
    render(<DragScrollHarness onItemClick={onItemClick} />);
    const scroller = screen.getByTestId('scroller');

    fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(scroller, { clientX: 99, pointerId: 1 });
    fireEvent.pointerUp(scroller, { clientX: 99, pointerId: 1 });
    fireEvent.click(screen.getByText('item'));

    expect(onItemClick).toHaveBeenCalledOnce();
  });

  it('임계값 이상 드래그한 뒤에는 그 아래 요소의 클릭을 막는다', () => {
    const onItemClick = vi.fn();
    render(<DragScrollHarness onItemClick={onItemClick} />);
    const scroller = screen.getByTestId('scroller');

    fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(scroller, { clientX: 50, pointerId: 1 });
    fireEvent.pointerUp(scroller, { clientX: 50, pointerId: 1 });
    fireEvent.click(screen.getByText('item'));

    expect(onItemClick).not.toHaveBeenCalled();
  });
});
