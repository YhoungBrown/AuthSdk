import { useAuthSDK } from '../src/core/auth-store';

describe('Auth Store (Zustand)', () => {
  beforeEach(() => {
    // Reset state
    useAuthSDK.setState({ status: 'unauthenticated', user: null, initialized: false } as any);
  });

  test('signIn sets authenticated state', () => {
    const fakeUser = { uid: '123', email: 'a@b.com' } as any;
    useAuthSDK.getState().signIn(fakeUser);
    const state = useAuthSDK.getState();
    expect(state.status).toBe('authenticated');
    expect(state.user).toBe(fakeUser);
    expect(state.initialized).toBe(true);
  });

  test('signOut sets unauthenticated', () => {
    useAuthSDK.getState().signOut();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
    expect(state.initialized).toBe(true);
  });

  test('setTokenExpired sets tokenExpired', () => {
    // call optional if exists
    const s = useAuthSDK.getState();
    if (s.setTokenExpired) s.setTokenExpired();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('tokenExpired');
    expect(state.user).toBeNull();
  });
});
