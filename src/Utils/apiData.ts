export function getErrorMessage(error: unknown, fallback = "Đã xảy ra lỗi") {
  if (typeof error === "object" && error) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return err.response?.data?.message || err.message || fallback;
  }
  return fallback;
}

export function unwrapData<T = unknown>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const data = (raw as { data: T }).data;
    if (data !== undefined) return data;
  }
  return raw as T;
}

export function unwrapList<T = unknown>(raw: unknown): {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
} {
  const root = unwrapData(raw) as Record<string, unknown> | T[] | undefined;

  if (Array.isArray(root)) {
    return { items: root, total: root.length };
  }

  if (!root || typeof root !== "object") {
    return { items: [], total: 0 };
  }

  const nested = unwrapData(root) as Record<string, unknown> | T[];
  const source =
    nested && typeof nested === "object" && !Array.isArray(nested)
      ? nested
      : root;

  const candidate =
    (source.items as T[] | undefined) ??
    (source.users as T[] | undefined) ??
    (source.transactions as T[] | undefined) ??
    (source.drivers as T[] | undefined) ??
    (source.registrations as T[] | undefined) ??
    (source.rides as T[] | undefined) ??
    (source.listings as T[] | undefined) ??
    (source.reports as T[] | undefined) ??
    (source.categories as T[] | undefined) ??
    (Array.isArray(source.data) ? (source.data as T[]) : undefined) ??
    (Array.isArray(nested) ? nested : undefined) ??
    [];

  const items = Array.isArray(candidate) ? candidate : [];
  const pagination = (source.pagination ?? source.meta ?? {}) as Record<
    string,
    unknown
  >;
  const total = Number(
    source.total ?? pagination.total ?? items.length
  );

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
    page: Number(source.page ?? pagination.page) || undefined,
    limit: Number(source.limit ?? pagination.limit) || undefined,
  };
}
