import { apiClient } from "./client";
import type {
  TokenResponse, User, LoginRequest, RegisterRequest, ChangePasswordRequest,
} from "../types/api";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.append("username", data.username);
  form.append("password", data.password);
  const res = await apiClient.post<TokenResponse>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
}

export async function register(data: RegisterRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/register", data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<any>("/auth/me");
  return { ...res.data, id: res.data.user_id };
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await apiClient.post("/auth/change-password", data);
}
