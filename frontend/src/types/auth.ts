export interface AuthProfile {
  profileId: number;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  status: string | null;
}

export interface AuthAccount {
  accountId: number;
  username: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
  profile: AuthProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  account: AuthAccount;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
