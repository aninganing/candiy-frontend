import { afterEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth.store';

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  localStorage.clear();
});

describe('useAuthStore', () => {
  it('초기 상태는 로그인되어 있지 않다', () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('login하면 이름을 user로 저장한다', () => {
    useAuthStore.getState().login('홍길동');

    expect(useAuthStore.getState().user).toEqual({ name: '홍길동' });
  });

  it('logout하면 user를 초기화한다', () => {
    useAuthStore.getState().login('홍길동');
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
  });
});
