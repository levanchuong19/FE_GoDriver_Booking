import {
  getUsedCarId,
  type UsedCarListing,
  type UsedCarMedia,
} from "../models/UsedCar";
import { unwrapData } from "./apiData";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function pickNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function pickBool(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return undefined;
}

function pickId(value: unknown) {
  const obj = asRecord(value);
  return pickString(obj._id, obj.id, value);
}

function normalizeMedia(raw: unknown): UsedCarMedia[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = asRecord(item);
      const url = pickString(
        row.url,
        row.secureUrl,
        row.secure_url,
        row.path,
        row.src,
        row.thumbnailUrl
      );
      if (!url) return null;
      return {
        id: pickString(row.id, row._id, row.mediaId),
        _id: pickString(row._id, row.id, row.mediaId),
        url,
        type: pickString(row.type, row.mediaType),
        isCover: Boolean(row.isCover || row.cover || row.isPrimary),
      } as UsedCarMedia;
    })
    .filter((item): item is UsedCarMedia => Boolean(item));
}

function normalizeFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function nestedName(value: unknown) {
  const obj = asRecord(value);
  return pickString(obj.name, obj.title, obj.label, obj.code);
}

/**
 * Chuẩn hóa mọi dạng response chi tiết tin xe cũ về 1 object phẳng dùng được cho form/xem.
 */
export function normalizeUsedCarDetail(raw: unknown): UsedCarListing {
  const root = asRecord(unwrapData(raw) ?? raw);
  const listing = asRecord(
    root.listing ||
      root.item ||
      root.usedCar ||
      root.car ||
      (root.data && typeof root.data === "object" && !Array.isArray(root.data)
        ? root.data
        : root)
  );

  const source =
    listing.title || listing._id || listing.id ? listing : root;

  const brand =
    asRecord(source.brand) ||
    asRecord(source.brandInfo) ||
    {};
  const model =
    asRecord(source.model) ||
    asRecord(source.modelInfo) ||
    {};
  const variant =
    asRecord(source.variant) ||
    asRecord(source.variantInfo) ||
    {};

  const sellerRaw = source.sellerId ?? source.seller ?? source.owner;
  const sellerObj = asRecord(sellerRaw);
  const sellerId =
    typeof sellerRaw === "string"
      ? sellerRaw
      : sellerObj._id || sellerObj.id
        ? {
            _id: pickString(sellerObj._id, sellerObj.id),
            fullName: pickString(
              sellerObj.fullName,
              sellerObj.name,
              sellerObj.contactName
            ),
            phone: pickString(sellerObj.phone, sellerObj.contactPhone),
            email: pickString(sellerObj.email),
          }
        : undefined;

  const media = normalizeMedia(
    source.media || source.images || source.photos || root.media
  );

  const normalized: UsedCarListing = {
    id: pickString(source.id, source._id),
    _id: pickString(source._id, source.id),
    vehicleType: pickString(source.vehicleType, source.type),
    title: pickString(source.title, source.name),
    description: pickString(source.description, source.content),
    manufactureYear: pickNumber(
      source.manufactureYear,
      source.year,
      source.modelYear
    ),
    mileage: pickNumber(source.mileage, source.odo, source.odometer),
    price: pickNumber(source.price, source.askingPrice),
    negotiable: pickBool(source.negotiable, source.isNegotiable) ?? false,
    transmission: pickString(source.transmission),
    fuelType: pickString(source.fuelType, source.fuel),
    condition: pickString(source.condition),
    status: pickString(source.status) as UsedCarListing["status"],
    viewsCount: pickNumber(source.viewsCount, source.views),
    favoritesCount: pickNumber(source.favoritesCount, source.favorites),
    contactsCount: pickNumber(source.contactsCount, source.contacts),
    media,
    features: normalizeFeatures(source.features || source.highlights),
    contactName: pickString(
      source.contactName,
      sellerObj.fullName,
      sellerObj.name
    ),
    contactPhone: pickString(
      source.contactPhone,
      sellerObj.phone
    ),
    plateNumber: pickString(source.plateNumber, source.licensePlate, source.plate),
    exteriorColor: pickString(
      source.exteriorColor,
      source.color,
      source.outerColor
    ),
    interiorColor: pickString(source.interiorColor, source.innerColor),
    bodyType: pickString(source.bodyType),
    brandId: pickString(source.brandId, pickId(source.brand)),
    modelId: pickString(source.modelId, pickId(source.model)),
    variantId: pickString(source.variantId, pickId(source.variant)),
    brandName: pickString(
      source.brandName,
      nestedName(source.brand),
      brand.name
    ),
    modelName: pickString(
      source.modelName,
      nestedName(source.model),
      model.name
    ),
    variantName: pickString(
      source.variantName,
      nestedName(source.variant),
      variant.name
    ),
    provinceCode: pickString(source.provinceCode, source.province),
    districtCode: pickString(source.districtCode, source.district),
    provinceName: pickString(
      source.provinceName,
      nestedName(source.province)
    ),
    districtName: pickString(
      source.districtName,
      nestedName(source.district)
    ),
    sellerId: sellerId as UsedCarListing["sellerId"],
    createdAt: pickString(source.createdAt),
    updatedAt: pickString(source.updatedAt),
    submittedAt: pickString(source.submittedAt),
    publishedAt: pickString(source.publishedAt),
    rejectionReason: pickString(
      source.rejectionReason,
      source.rejectReason,
      source.reason
    ),
    statusHistory: Array.isArray(root.statusHistory)
      ? (root.statusHistory as Array<Record<string, unknown>>)
      : Array.isArray(source.statusHistory)
        ? (source.statusHistory as Array<Record<string, unknown>>)
        : [],
    moderationLogs: Array.isArray(root.moderationLogs)
      ? (root.moderationLogs as Array<Record<string, unknown>>)
      : Array.isArray(source.moderationLogs)
        ? (source.moderationLogs as Array<Record<string, unknown>>)
        : [],
  };

  // đảm bảo có id
  if (!getUsedCarId(normalized) && pickString(root.id, root._id)) {
    normalized.id = pickString(root.id, root._id);
    normalized._id = pickString(root._id, root.id);
  }

  return normalized;
}

export function usedCarToFormValues(detail: UsedCarListing) {
  return {
    vehicleType: detail.vehicleType || "CAR",
    title: detail.title || "",
    description: detail.description || "",
    manufactureYear: detail.manufactureYear,
    mileage: detail.mileage,
    price: detail.price ?? 0,
    negotiable: detail.negotiable ?? true,
    transmission: detail.transmission,
    fuelType: detail.fuelType,
    condition: detail.condition,
    bodyType: detail.bodyType,
    exteriorColor: detail.exteriorColor || "",
    interiorColor: detail.interiorColor || "",
    contactName: detail.contactName || "",
    contactPhone: detail.contactPhone || "",
    plateNumber: detail.plateNumber || "",
    provinceCode: detail.provinceCode || "",
    districtCode: detail.districtCode || "",
    brandId: detail.brandId || "",
    modelId: detail.modelId || "",
    variantId: detail.variantId || "",
  };
}
