import { cookies } from "next/headers";

export const fetchWithAuth = async <T = unknown>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};
