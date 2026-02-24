const fetchData = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      (json as { message?: string }).message || `Error ${response.status}`,
    );
  }
  return json as T;
};

export { fetchData };
