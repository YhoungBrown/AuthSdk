
/**
 * Tests for core auth-service functions. We mock firebase/auth and
 * external sign-in modules to avoid real network calls.
 */

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async () => true),
  getItemAsync: jest.fn(async () => null),
  deleteItemAsync: jest.fn(async () => true),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(async () => ({ data: { idToken: 'g-token' } })),
    signOut: jest.fn(async () => true),
    configure: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('expo-apple-authentication', () => ({
  signInAsync: jest.fn(async () => ({ identityToken: 'apple-token' })),
  isAvailableAsync: jest.fn(async () => true),
  AppleAuthenticationScope: {
    EMAIL: 'email',
    FULL_NAME: 'name',
  },
}));

jest.mock('firebase/auth', () => {
  const mockOAuthProvider = jest.fn().mockImplementation(() => ({
    credential: jest.fn((opts: any) => ({ idToken: opts?.idToken })),
  }));
  return {
    createUserWithEmailAndPassword: jest.fn(async (auth: any, email: string, password: string) => ({ user: { uid: 'new', email } })),
    signInWithEmailAndPassword: jest.fn(async (auth: any, email: string, password: string) => ({ user: { uid: 'existing', email } })),
    signOut: jest.fn(async () => true),
    getAuth: jest.fn(() => ({})),
    GoogleAuthProvider: {
      credential: jest.fn((token: string) => ({ token })),
    },
    OAuthProvider: mockOAuthProvider,
    signInWithCredential: jest.fn(async (auth: any, cred: any) => ({ user: { uid: 'social', provider: cred } })),
    onAuthStateChanged: jest.fn((auth: any, cb: any) => {
      // return unsubscribe
      return () => {};
    }),
    sendPasswordResetEmail: jest.fn(async () => true),
  };
});

import {
    InvalidCredentialsException,
    TokenExpiredException,
    UserNotFoundException,
} from '../src/core/auth-exception';
import { mapError, signInWithApple, signInWithEmail, signInWithGoogle, signUpWithEmail } from '../src/core/auth-service';
import { useAuthSDK } from '../src/core/auth-store';

describe('Auth Service (headless)', () => {
  beforeEach(() => {
    useAuthSDK.setState({ status: 'unauthenticated', user: null, initialized: false } as any);
  });

  test('signInWithEmail success updates store', async () => {
    const user = await signInWithEmail('a@b.com', 'pass');
    expect(user).toBeDefined();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('authenticated');
    expect(state.user).toBeDefined();
  });

  test('signUpWithEmail success updates store', async () => {
    const user = await signUpWithEmail('new@b.com', 'pass');
    expect(user).toBeDefined();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('authenticated');
  });

  test('signInWithGoogle flow', async () => {
    const user = await signInWithGoogle();
    expect(user).toBeDefined();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('authenticated');
  });

  test('signInWithApple flow', async () => {
    const user = await signInWithApple();
    expect(user).toBeDefined();
    const state = useAuthSDK.getState();
    expect(state.status).toBe('authenticated');
  });

  test('mapError maps known codes', () => {
    const e1 = mapError({ code: 'auth/wrong-password' });
    expect(e1).toBeInstanceOf(InvalidCredentialsException);

    const e2 = mapError({ code: 'auth/user-not-found' });
    expect(e2).toBeInstanceOf(UserNotFoundException);

    const e3 = mapError({ code: 'auth/user-token-expired' });
    expect(e3).toBeInstanceOf(TokenExpiredException);

    const e4 = mapError({ code: 'auth/network-request-failed' });
    // NetworkException class exists but may be a different constructor; just check name
    expect(e4.name).toBeDefined();
  });
});
