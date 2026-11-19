export class ApiClientError extends Error {
  public status: number;
  public details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

const BASE_URL = '/api';

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = endpoint.startsWith('/') ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;
  const headers: Record<string, string> = {
    ...options.headers,
  };

  let body: string | undefined;
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include',
    });
  } catch (err) {
    throw new ApiClientError(0, err instanceof Error ? err.message : 'Network error');
  }

  const contentType = response.headers.get('content-type');
  const data: unknown =
    contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      errorMessage = String((data as { message: unknown }).message);
    }
    throw new ApiClientError(response.status, errorMessage, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) => apiClient<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown) => apiClient<T>(endpoint, { method: 'PUT', body }),
  del: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
};
