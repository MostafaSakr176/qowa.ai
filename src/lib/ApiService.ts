

type ApiServiceOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
  // You can add more options as needed
};

function createApiService(options?: ApiServiceOptions) {
  const baseUrl = process.env.BASE_URL || "http://api.qowa.ai";

  async function request<T>(
    url: string,
    reqOptions: RequestInit = {}
  ): Promise<T> {

    const defaultHeaders: Record<string, string> = {
      ...(options?.headers || {}),
    };

    function buildUrl(url: string) {
      return baseUrl ? `${baseUrl}/${url}` : url;
    }

    const finalUrl = buildUrl(url);
    const headers = {
      ...defaultHeaders,
      ...(reqOptions.headers || {}),
    };

    const response = await fetch(finalUrl, {
      ...reqOptions,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }
    const text = await response.text();
    return text as unknown as T;
  }

  function get<T>(url: string, reqOptions?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...reqOptions,
      method: "GET",
    });
  }

  function post<T, U = unknown>(url: string, body?: U, reqOptions?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...reqOptions,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(reqOptions?.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  function put<T, U = unknown>(url: string, body?: U, reqOptions?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...reqOptions,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(reqOptions?.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  function del<T>(url: string, reqOptions?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...reqOptions,
      method: "DELETE",
    });
  }

  return {
    get,
    post,
    put,
    delete: del,
    // For advanced use, you can expose request, buildUrl, etc.
  };
}

// Create a default instance to use everywhere, using locale from next-intl
const api = createApiService();

// Export both the factory and the default instance
export { createApiService as ApiService, api };

/**
 * ===========================
 * Example usages (client/server)
 * ===========================
 */

// Example 1: GET request (fetch users)
// async function fetchUsers() {
//   // Type the response as you expect
//   type User = { id: number; name: string };
//   const users = await api.get<User[]>("/api/users");
//   return users;
// }

// Example 2: POST request (create user)
// async function createUser() {
//   type User = { id: number; name: string };
//   const newUser = { name: "Alice" };
//   const created = await api.post<User, typeof newUser>("/api/users", newUser);
//   return created;
// }

// Example 3: Using custom instance with baseUrl
// const customApi = ApiService({ baseUrl: "https://jsonplaceholder.typicode.com" });

// async function fetchPosts() {
//   type Post = { id: number; title: string; body: string };
//   const posts = await customApi.get<Post[]>("/posts");
//   return posts;
// }

// Example 4: Using in a React client component
// import { api } from "@/utilities/ApiService";
// useEffect(() => {
//   api.get("/api/some-endpoint").then(data => setData(data));
// }, []);

// Example 5: Using in a Next.js server component or route handler
// import { api } from "@/utilities/ApiService";
// export async function GET() {
//   const data = await api.get("/api/some-endpoint");
//   return Response.json(data);
// }
