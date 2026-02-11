const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle token refresh - but NOT for auth endpoints (login, register, refresh)
    // to avoid infinite loops when login itself returns 401
    const isAuthEndpoint = endpoint.startsWith("/auth/login") ||
      endpoint.startsWith("/auth/register") ||
      endpoint.startsWith("/auth/refresh-token") ||
      endpoint.startsWith("/auth/forgot-password");

    if (response.status === 401 && !isAuthEndpoint && this.getRefreshToken()) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        const retryData = await retryResponse.json();
        if (!retryResponse.ok) {
          throw new ApiError(retryData.error || "Request failed", retryResponse.status, retryData);
        }
        return retryData;
      } else {
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || "Request failed", response.status, data);
    }

    return data;
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          name: string;
          avatarUrl?: string;
          roles: string[];
          permissions: string[];
        };
      };
    }>("/auth/login", { method: "POST", body: { email, password } });

    this.setTokens(data.data.accessToken, data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data.data;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request("/auth/me");
  }

  // Content endpoints
  get = <T = unknown>(endpoint: string) => this.request<T>(endpoint);
  post = <T = unknown>(endpoint: string, body: unknown) => this.request<T>(endpoint, { method: "POST", body });
  put = <T = unknown>(endpoint: string, body: unknown) => this.request<T>(endpoint, { method: "PUT", body });
  patch = <T = unknown>(endpoint: string, body: unknown) => this.request<T>(endpoint, { method: "PATCH", body });
  del = <T = unknown>(endpoint: string) => this.request<T>(endpoint, { method: "DELETE" });
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export const api = new ApiClient();
