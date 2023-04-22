export type SafeFetchOptions = {
  url: string;
  options?: RequestInit;
  timeout?: number;
};

export type SafeFetchResponse = {
  data?: any;
  error?: string;
  status?: number;
  statusText?: string;
  rawResponse?: Response;
};

export async function safeFetch({
  url,
  options,
  timeout = 5000,
}: SafeFetchOptions): Promise<SafeFetchResponse> {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal });

    if (!response.ok) {
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status,
        statusText: response.statusText,
        rawResponse: response,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return { error: "Request timed out" };
    }

    return { error: error.message };
  } finally {
    clearTimeout(timeoutId);
  }
}

// HELPER FUNCTIONS FOR POST/GET API calls
export type PostAPIOptions = {
  url: string;
  data: any;
  timeout?: number;
};

export type GetAPIOptions = {
  url: string;
  timeout?: number;
};

export async function postAPI({
  url,
  data,
  timeout,
}: PostAPIOptions): Promise<SafeFetchResponse> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return safeFetch({ url, options, timeout });
}

export async function getAPI({
  url,
  timeout,
}: GetAPIOptions): Promise<SafeFetchResponse> {
  const options: RequestInit = {
    method: "GET",
  };

  return safeFetch({ url, options, timeout });
}
