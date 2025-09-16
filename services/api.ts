import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Prefer an env var from app.json/expo config if available
const RAW_API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) ||
  ((Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_BASE_URL as string) ||
  'https://spendwise-backend-2nvv.onrender.com';
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, ''); // strip trailing slashes

function joinUrl(base: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

// Helpful during development to confirm where requests are going
if (__DEV__) {
  console.log(`[API] Base URL: ${API_BASE_URL}`);
}

export async function authHeaders(extra?: Record<string, string>) {
  const token = await AsyncStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  } as Record<string, string>;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = joinUrl(API_BASE_URL, path);
  const res = await fetch(url, { headers: await authHeaders() });
  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText} @ ${url}${text ? ` - ${text}` : ''}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = joinUrl(API_BASE_URL, path);
  const res = await fetch(url, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`POST ${path} failed: ${res.status} ${res.statusText} @ ${url}${text ? ` - ${text}` : ''}`);
  }
  return res.json();
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
