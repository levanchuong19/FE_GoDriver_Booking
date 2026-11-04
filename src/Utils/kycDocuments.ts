const DOC_FLAT_KEYS = [
  "idFrontUrl",
  "idBackUrl",
  "portraitUrl",
  "driverLicenseFrontUrl",
  "driverLicenseBackUrl",
  "vneidUrl",
  "vehicleRegistrationUrl",
  "insuranceUrl",
  "registrationUrl",
  "cavetUrl",
  "plateUrl",
] as const;

const PLACEHOLDER_KEYS = new Set(
  DOC_FLAT_KEYS.map((key) => key.toLowerCase())
);

/** Extract a usable media URL from string | Cloudinary-like object. */
export function resolveMediaUrl(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    // Reuse-flow bug: value accidentally stored as the field name itself
    if (PLACEHOLDER_KEYS.has(trimmed.toLowerCase())) return "";
    return trimmed;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const url = resolveMediaUrl(item);
      if (url) return url;
    }
    return "";
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return resolveMediaUrl(
      obj.secure_url ??
        obj.url ??
        obj.href ??
        obj.path ??
        obj.location ??
        obj.src ??
        obj.file ??
        obj.publicUrl
    );
  }

  return "";
}

function preferUrl(current: string | undefined, next: string): string {
  if (!next) return current || "";
  if (!current) return next;
  const currentOk = /^https?:\/\//i.test(current);
  const nextOk = /^https?:\/\//i.test(next);
  if (!currentOk && nextOk) return next;
  return current;
}

/**
 * Merge KYC / vehicle document bags from hire-driver + ride-hailing payloads.
 * Prefer real http(s) URLs over placeholders or non-URL strings.
 */
export function collectKycDocuments(
  ...sources: unknown[]
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const obj = source as Record<string, unknown>;

    for (const bag of [obj.documents, obj.docs, obj.kycDocuments, obj.files]) {
      if (!bag || typeof bag !== "object" || Array.isArray(bag)) continue;
      for (const [key, value] of Object.entries(
        bag as Record<string, unknown>
      )) {
        const url = resolveMediaUrl(value);
        if (!url) continue;
        out[key] = preferUrl(out[key], url);
      }
    }

    for (const key of DOC_FLAT_KEYS) {
      const url = resolveMediaUrl(obj[key]);
      if (!url) continue;
      out[key] = preferUrl(out[key], url);
    }
  }

  return out;
}

export function documentsToMediaEntries(
  documents: Record<string, string>
): [string, string][] {
  return Object.entries(documents).filter(([, url]) =>
    Boolean(resolveMediaUrl(url))
  ) as [string, string][];
}
