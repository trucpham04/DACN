"use client";

import { useMutation } from "./use-mutation";
import {
  login,
  register,
  logout,
  refreshToken,
  changePassword,
} from "@/services/auth-service";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  LogoutInput,
  RefreshTokenInput,
  AuthTokens,
  ChangePasswordInput,
} from "@/types/auth";

export function useLogin() {
  return useMutation<LoginResponse, LoginInput>("/auth/login", login);
}

export function useRegister() {
  return useMutation<LoginResponse, RegisterInput>("/auth/register", register);
}

export function useLogout() {
  return useMutation<null, LogoutInput>("/auth/logout", logout);
}

export function useRefreshToken() {
  return useMutation<AuthTokens, RefreshTokenInput>(
    "/auth/refresh-token",
    refreshToken,
  );
}

export function useChangePassword() {
  return useMutation<null, ChangePasswordInput>(
    "/auth/change-password",
    changePassword,
  );
}
