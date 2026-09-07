'use client';

import { useRef } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const drag = useRef({ isDragging: false, dragged: false, startX: 0, startScrollLeft: 0 });

  function onPointerDown(event: React.PointerEvent<T>) {
    const el = ref.current;
    if (!el || event.button !== 0) return;

    drag.current = {
      isDragging: true,
      dragged: false,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
    };
    el.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<T>) {
    const el = ref.current;
    if (!el || !drag.current.isDragging) return;

    const delta = event.clientX - drag.current.startX;
    // 클릭과 드래그를 구분하는 임계값
    // 이 이상 움직여야 실제 드래그로 보고, 이후 onClickCapture에서 그 아래 칩의 클릭(예: 날짜 선택)을 막는다.
    if (Math.abs(delta) > 3) drag.current.dragged = true;
    el.scrollLeft = drag.current.startScrollLeft - delta;
  }

  function onPointerUp(event: React.PointerEvent<T>) {
    drag.current.isDragging = false;
    ref.current?.releasePointerCapture?.(event.pointerId);
  }

  function onClickCapture(event: React.MouseEvent<T>) {
    if (drag.current.dragged) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.dragged = false;
    }
  }

  return {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onClickCapture,
  };
}
