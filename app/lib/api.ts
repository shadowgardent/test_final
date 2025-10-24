// lib/api.ts
import { getToken } from "./auth";

const BASE = ""; // ใช้เส้นทางสัมพัทธ์ใน Next.js

export async function apiRegister(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Register failed");
  return res.json() as Promise<{ token: string; user: any }>;
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json() as Promise<{ token: string; user: any }>;
}

export async function apiMe() {
  const token = getToken();
  if (!token) throw new Error("Missing token");
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Unauthorized");
  return res.json() as Promise<{ user: any }>;
}

export async function apiUsers(params?: { q?: string; page?: number; limit?: number; sort?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.sort) qs.set("sort", params.sort);
  const res = await fetch(`${BASE}/api/auth/users${qs.toString() ? `?${qs}` : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error((await res.json()).message || "Fetch users failed");
  return res.json() as Promise<{ users: any[]; page: number; pages: number; total: number }>;
}

export async function apiUpdateUser(
  id: string,
  data: { name?: string; email?: string; password?: string }
) {
  const token = getToken();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${BASE}/api/auth/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Update user failed");
  return res.json() as Promise<{ message: string; user: any }>;
}

export async function apiDeleteUser(id: string) {
  const token = getToken();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${BASE}/api/auth/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Delete user failed");
  return res.json() as Promise<{ message: string }>;
}
