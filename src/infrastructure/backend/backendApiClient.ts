import { backendConfig } from './backendConfig';
import type {
  BackendApiErrorPayload,
  BackendProductDto,
} from './backendTypes';

export class BackendApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: BackendApiErrorPayload | string | null,
  ) {
    super(message);
    this.name = 'BackendApiError';
  }
}

type RequestInitWithBody = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function resolveErrorMessage(
  payload: BackendApiErrorPayload | string | null | undefined,
  fallback: string,
): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (!payload) {
    return fallback;
  }

  return payload.message ?? payload.error ?? fallback;
}

async function requestJson<T>(
  path: string,
  init: RequestInitWithBody = {},
): Promise<T> {
  if (typeof fetch !== 'function') {
    throw new BackendApiError('Fetch API is not available.', 0, null);
  }

  const response = await fetch(`${backendConfig.baseUrl}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': backendConfig.apiKey,
      ...(init.headers ?? {}),
    },
    body:
      init.body === undefined
        ? undefined
        : JSON.stringify(init.body),
    signal: init.signal,
  });

  const parsedBody = (await parseResponseBody(
    response,
  )) as BackendApiErrorPayload | string | null;

  if (!response.ok) {
    throw new BackendApiError(
      resolveErrorMessage(parsedBody, `Request failed with status ${response.status}`),
      response.status,
      parsedBody,
    );
  }

  return parsedBody as T;
}

export type BackendStoreApiPort = {
  getProducts(): Promise<BackendProductDto[]>;
};

export function createBackendStoreApiClient(): BackendStoreApiPort {
  return {
    getProducts: () => requestJson<BackendProductDto[]>('/products'),
  };
}

export const backendStoreApiClient = createBackendStoreApiClient();
