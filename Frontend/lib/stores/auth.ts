"use client";
import { create } from "zustand";
import type { User } from "../types/api";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => {
    localStorage.setItem("nexus_token", token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("nexus_token");
    set({ token: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("nexus_token");
    if (token) set({ token });
  },
}));
