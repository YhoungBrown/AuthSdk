import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    NetworkException,
    TokenExpiredException,
    UserNotFoundException,
    WeakPasswordException,
} from '../src/core/auth-exception';

describe('Auth Exceptions', () => {
  test('exception names and messages', () => {
    const e1 = new InvalidCredentialsException();
    expect(e1.name).toBe('InvalidCredentialsException');
    expect(e1.message).toBe('Invalid email or password.');

    const e2 = new UserNotFoundException();
    expect(e2.name).toBe('UserNotFoundException');

    const e3 = new EmailAlreadyInUseException();
    expect(e3.name).toBe('EmailAlreadyInUseException');

    const e4 = new WeakPasswordException();
    expect(e4.name).toBe('WeakPasswordException');

    const e5 = new TokenExpiredException();
    expect(e5.name).toBe('TokenExpiredException');

    const e6 = new NetworkException();
    expect(e6.name).toBe('NetworkException');
  });
});
