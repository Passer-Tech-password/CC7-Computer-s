"use client";

import { getFirebaseClientAsync } from "@/lib/firebase";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  url: string;
  payload?: unknown;

  constructor(message: string, opts: { status: number; url: string; payload?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.url = opts.url;
    this.payload = opts.payload;
  }
}

function getBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return null;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function isApiEnabled(): boolean {
  return Boolean(getBaseUrl());
}

async function getAuthToken(): Promise<string | null> {
  try {
    const { auth } = await getFirebaseClientAsync();
    const user = auth.currentUser;
    if (!user) return null;
    const { getIdToken } = await import("firebase/auth");
    return await getIdToken(user);
  } catch {
    return null;
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiRequest<T>(path: string, opts: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new ApiError("API is not configured. Set NEXT_PUBLIC_API_URL.", { status: 0, url: path });
  }

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts.headers
  };

  if (opts.auth !== false) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    throw new ApiError(`API request failed (${res.status})`, { status: res.status, url, payload });
  }

  const payload = (await parseJsonSafe(res)) as T;
  return payload;
}

