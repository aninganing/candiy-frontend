import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetCheckupMockState } from '@/shared/mocks/handlers/checkup.handlers';
import { server } from '@/shared/mocks/server';

// jsdom엔 matchMedia가 없다. 다크모드 감지(useChartColors 등)에서 공통으로 필요해 전역으로 스텁한다.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom엔 requestAnimationFrame도 없다. 차트 애니메이션(GaugeRangeChart 등)에서 필요해 스텁한다.
if (typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16);
  window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle);
}

if (typeof window.ResizeObserver !== 'function') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom은 canvas 2d 컨텍스트를 지원하지 않아 getContext 호출마다 "Not implemented" 경고를 찍는다.
// Chart.js는 null 컨텍스트를 이미 문제없이 처리하므로(react-chartjs-2를 mock하지 않는 대시보드 테스트들),
// 동일하게 null을 반환하되 경고 로그만 없애도록 오버라이드한다.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

// 위에서 getContext가 null을 반환하면 Chart.js가 초기화를 조용히 건너뛰면서 이 메시지를 console.error로 찍는다.
// 렌더 실패가 아니라 이 테스트 환경의 알려진 한계라 이 메시지만 걸러내고, 다른 console.error는 그대로 노출한다.
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes("Failed to create chart: can't acquire context from the given item")
  ) {
    return;
  }
  originalConsoleError(...args);
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetCheckupMockState();
});
afterAll(() => server.close());
