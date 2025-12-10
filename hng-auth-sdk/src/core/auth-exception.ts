// File: hng-auth-sdk/src/core/auth-exception.ts

export class InvalidCredentialsException extends Error {
  constructor(message: string = "Invalid email or password.") {
    super(message);
    this.name = "InvalidCredentialsException";
  }
}

export class UserNotFoundException extends Error {
  constructor(message: string = "Account does not exist.") {
    super(message);
    this.name = "UserNotFoundException";
  }
}

export class EmailAlreadyInUseException extends Error {
  constructor(message: string = "Email is already in use.") {
    super(message);
    this.name = "EmailAlreadyInUseException";
  }
}

export class WeakPasswordException extends Error {
  constructor(message: string = "Password is too weak.") {
    super(message);
    this.name = "WeakPasswordException";
  }
}

export class TokenExpiredException extends Error {
  constructor(message: string = "Session expired. Please sign in again.") {
    super(message);
    this.name = "TokenExpiredException";
  }
}

export class NetworkException extends Error {
  constructor(message: string = "Network error. Check your connection.") {
    super(message);
    this.name = "NetworkException";
  }
}

// Additional helpful exceptions
export class TooManyRequestsException extends Error {}
export class AuthOperationFailedException extends Error {}
