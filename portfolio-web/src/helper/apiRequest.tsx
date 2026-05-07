export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5001";

export const BASE_URL = `${API_ORIGIN}/`;
export const API_URL = `${API_ORIGIN}/api`;

interface ApiRequestConfig {
  endpoint: string;
  body?: unknown;
  headers?: Record<string, string>;
  isMultiPart?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = window.localStorage.getItem("token");
  if (storedToken) {
    try {
      return JSON.parse(storedToken);
    } catch {
      return storedToken;
    }
  }

  const storedUser = window.localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser)?.token || null;
  } catch {
    return null;
  }
};

const normalizeEndpoint = (endpoint: string) => endpoint.replace(/^\/+/, "");

export const resolveAssetUrl = (path?: string | null) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const apiRequest = async ({
  endpoint,
  method,
  body,
  headers,
  isMultiPart = false,
}: ApiRequestConfig & { method: string }) => {
  const token = getStoredToken();
  const configHeaders: HeadersInit = {
    ...headers,
  };

  if (!isMultiPart) {
    configHeaders["Content-Type"] = "application/json";
  }

  if (token && !configHeaders.Authorization && !configHeaders.token) {
    configHeaders.Authorization = `Bearer ${token}`;
    configHeaders.token = token;
  }

  const response = await fetch(`${API_URL}/${normalizeEndpoint(endpoint)}`, {
    method,
    headers: configHeaders,
    body: body ? (isMultiPart ? (body as BodyInit) : JSON.stringify(body)) : undefined,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : "API request failed";

    throw new ApiError(message, response.status, data);
  }

  return data;
};

export const get = async (endpoint: string, headers?: Record<string, string>) => {
  return apiRequest({ endpoint, method: "GET", headers });
};

export const post = async (
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
  isMultiPart = false,
) => {
  return apiRequest({ endpoint, method: "POST", body, headers, isMultiPart });
};

export const put = async (
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
  isMultiPart = false,
) => {
  return apiRequest({ endpoint, method: "PUT", body, headers, isMultiPart });
};

export const patch = async (
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
  isMultiPart = false,
) => {
  return apiRequest({ endpoint, method: "PATCH", body, headers, isMultiPart });
};

export const del = async (endpoint: string, headers?: Record<string, string>) => {
  return apiRequest({ endpoint, method: "DELETE", headers });
};

const api = { get, post, put, patch, del };

export default api;
