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

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetCheckupMockState();
});
afterAll(() => server.close());
