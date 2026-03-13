import apiClient from "./api-client";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  LogoutInput,
  RefreshTokenInput,
  AuthTokens,
  ChangePasswordInput,
} from "@/types/auth";

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/auth/login", input);
  return res.data as LoginResponse;
}

export async function register(input: RegisterInput): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/auth/register", input);
  return res.data as LoginResponse;
}

export async function logout(input: LogoutInput): Promise<null> {
  await apiClient.post("/auth/logout", input);
  return null;
}

export async function refreshToken(input: RefreshTokenInput): Promise<AuthTokens> {
  const res = await apiClient.post<AuthTokens>("/auth/refresh-token", input);
  return res.data as AuthTokens;
}

export async function changePassword(input: ChangePasswordInput): Promise<null> {
  await apiClient.put("/auth/change-password", input);
  return null;
}
