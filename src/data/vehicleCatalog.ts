import apiSnapshot from "./apiCatalogSnapshot";

export type CatalogVehicleType =
  | "CAR"
  | "MOTORBIKE"
  | "ELECTRIC_CAR"
  | "ELECTRIC_MOTORBIKE"
  | string;

export interface CatalogVariant {
  id: string;
  code: string;
  name: string;
}

export interface CatalogModel {
  id: string;
  code: string;
  name: string;
  vehicleType?: CatalogVehicleType | null;
  variants: CatalogVariant[];
}

export interface CatalogBrand {
  id: string;
  code: string;
  name: string;
  vehicleTypes: CatalogVehicleType[];
  models: CatalogModel[];
}

/**
 * Đưa mọi key (local:xxx / tên tự nhập) về ObjectId 24 hex để API nhận được.
 * Id Mongo thật (24 hex) giữ nguyên.
 * Dùng nhiều seed FNV để tránh trùng id giữa các hãng (lỗi cũ: mọi key ra cùng 1 id).
 */
export function toCatalogObjectId(input: string): string {
  const text = String(input || "").trim();
  if (/^[a-fA-F0-9]{24}$/.test(text)) return text.toLowerCase();

  const src = `smartdrive:catalog:${text.toLowerCase()}`;
  const seeds = [2166136261, 1469598101, 2246822519, 3266489917];
  const bytes: number[] = [];

  for (const seed of seeds) {
    let h = seed >>> 0;
    for (let i = 0; i < src.length; i += 1) {
      h ^= src.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= src.length + seed;
    h = Math.imul(h ^ (h >>> 16), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    h ^= h >>> 16;
    bytes.push(
      (h >>> 24) & 0xff,
      (h >>> 16) & 0xff,
      (h >>> 8) & 0xff,
      h & 0xff
    );
  }

  return bytes
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const localIdSet = new Set<string>();

/** Id phát sinh từ catalog FE / nhập tay (không có trên vehicle-catalog server). */
export function isLocalCatalogId(id?: string | null) {
  if (!id) return false;
  const raw = String(id);
  if (raw.startsWith("local:") || raw.startsWith("custom:")) return true;
  return localIdSet.has(raw) || localIdSet.has(toCatalogObjectId(raw));
}

function trackLocalId(id: string) {
  localIdSet.add(id);
  localIdSet.add(toCatalogObjectId(id));
  return toCatalogObjectId(id);
}

function mapLocalBrand(brand: CatalogBrand): CatalogBrand {
  return {
    ...brand,
    id: trackLocalId(brand.id),
    models: brand.models.map((model) => ({
      ...model,
      id: trackLocalId(model.id),
      variants: model.variants.map((variant) => ({
        ...variant,
        id: trackLocalId(variant.id),
      })),
    })),
  };
}

const localExtras: CatalogBrand[] = [
  {
    id: "local:mercedes",
    code: "MERCEDES",
    name: "Mercedes-Benz",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:mercedes:s-class",
        code: "S_CLASS",
        name: "S-Class",
        vehicleType: "CAR",
        variants: [
          { id: "local:mercedes:s450", code: "S450", name: "S450" },
          { id: "local:mercedes:s500", code: "S500", name: "S500" },
          { id: "local:mercedes:maybach", code: "MAYBACH_S450", name: "Maybach S450" },
        ],
      },
      {
        id: "local:mercedes:c-class",
        code: "C_CLASS",
        name: "C-Class",
        vehicleType: "CAR",
        variants: [
          { id: "local:mercedes:c180", code: "C180", name: "C180" },
          { id: "local:mercedes:c200", code: "C200", name: "C200" },
          { id: "local:mercedes:c300", code: "C300", name: "C300" },
        ],
      },
      {
        id: "local:mercedes:e-class",
        code: "E_CLASS",
        name: "E-Class",
        vehicleType: "CAR",
        variants: [
          { id: "local:mercedes:e200", code: "E200", name: "E200" },
          { id: "local:mercedes:e300", code: "E300", name: "E300" },
        ],
      },
      {
        id: "local:mercedes:glc",
        code: "GLC",
        name: "GLC",
        vehicleType: "CAR",
        variants: [
          { id: "local:mercedes:glc200", code: "GLC200", name: "GLC 200" },
          { id: "local:mercedes:glc300", code: "GLC300", name: "GLC 300" },
        ],
      },
    ],
  },
  {
    id: "local:bmw",
    code: "BMW",
    name: "BMW",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:bmw:3",
        code: "SERIES_3",
        name: "3 Series",
        vehicleType: "CAR",
        variants: [
          { id: "local:bmw:320i", code: "320i", name: "320i" },
          { id: "local:bmw:330i", code: "330i", name: "330i" },
        ],
      },
      {
        id: "local:bmw:5",
        code: "SERIES_5",
        name: "5 Series",
        vehicleType: "CAR",
        variants: [
          { id: "local:bmw:520i", code: "520i", name: "520i" },
          { id: "local:bmw:530i", code: "530i", name: "530i" },
        ],
      },
      {
        id: "local:bmw:x5",
        code: "X5",
        name: "X5",
        vehicleType: "CAR",
        variants: [
          { id: "local:bmw:x5-xdrive40i", code: "X5_40I", name: "xDrive40i" },
        ],
      },
    ],
  },
  {
    id: "local:audi",
    code: "AUDI",
    name: "Audi",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:audi:a4",
        code: "A4",
        name: "A4",
        vehicleType: "CAR",
        variants: [{ id: "local:audi:a4-40", code: "A4_40", name: "A4 40 TFSI" }],
      },
      {
        id: "local:audi:a6",
        code: "A6",
        name: "A6",
        vehicleType: "CAR",
        variants: [{ id: "local:audi:a6-45", code: "A6_45", name: "A6 45 TFSI" }],
      },
      {
        id: "local:audi:q5",
        code: "Q5",
        name: "Q5",
        vehicleType: "CAR",
        variants: [{ id: "local:audi:q5-45", code: "Q5_45", name: "Q5 45 TFSI" }],
      },
    ],
  },
  {
    id: "local:lexus",
    code: "LEXUS",
    name: "Lexus",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:lexus:rx",
        code: "RX",
        name: "RX",
        vehicleType: "CAR",
        variants: [
          { id: "local:lexus:rx350", code: "RX350", name: "RX 350" },
          { id: "local:lexus:rx350h", code: "RX350H", name: "RX 350h" },
        ],
      },
      {
        id: "local:lexus:es",
        code: "ES",
        name: "ES",
        vehicleType: "CAR",
        variants: [{ id: "local:lexus:es250", code: "ES250", name: "ES 250" }],
      },
    ],
  },
  {
    id: "local:mitsubishi",
    code: "MITSUBISHI",
    name: "Mitsubishi",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:mitsubishi:xpander",
        code: "XPANDER",
        name: "Xpander",
        vehicleType: "CAR",
        variants: [
          { id: "local:mitsubishi:xpander-at", code: "XPANDER_AT", name: "AT" },
          { id: "local:mitsubishi:xpander-cross", code: "XPANDER_CROSS", name: "Cross" },
        ],
      },
      {
        id: "local:mitsubishi:triton",
        code: "TRITON",
        name: "Triton",
        vehicleType: "CAR",
        variants: [{ id: "local:mitsubishi:triton-4x4", code: "TRITON_4X4", name: "4x4 Athlete" }],
      },
      {
        id: "local:mitsubishi:outlander",
        code: "OUTLANDER",
        name: "Outlander",
        vehicleType: "CAR",
        variants: [{ id: "local:mitsubishi:outlander-premium", code: "OUTLANDER_PREMIUM", name: "Premium" }],
      },
    ],
  },
  {
    id: "local:nissan",
    code: "NISSAN",
    name: "Nissan",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:nissan:almera",
        code: "ALMERA",
        name: "Almera",
        vehicleType: "CAR",
        variants: [{ id: "local:nissan:almera-vl", code: "ALMERA_VL", name: "VL" }],
      },
      {
        id: "local:nissan:navara",
        code: "NAVARA",
        name: "Navara",
        vehicleType: "CAR",
        variants: [{ id: "local:nissan:navara-vl", code: "NAVARA_VL", name: "VL" }],
      },
      {
        id: "local:nissan:terra",
        code: "TERRA",
        name: "Terra",
        vehicleType: "CAR",
        variants: [{ id: "local:nissan:terra-vl", code: "TERRA_VL", name: "VL" }],
      },
    ],
  },
  {
    id: "local:peugeot",
    code: "PEUGEOT",
    name: "Peugeot",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:peugeot:3008",
        code: "3008",
        name: "3008",
        vehicleType: "CAR",
        variants: [{ id: "local:peugeot:3008-gt", code: "3008_GT", name: "GT" }],
      },
      {
        id: "local:peugeot:5008",
        code: "5008",
        name: "5008",
        vehicleType: "CAR",
        variants: [{ id: "local:peugeot:5008-gt", code: "5008_GT", name: "GT" }],
      },
    ],
  },
  {
    id: "local:chevrolet",
    code: "CHEVROLET",
    name: "Chevrolet",
    vehicleTypes: ["CAR"],
    models: [
      {
        id: "local:chevrolet:colorado",
        code: "COLORADO",
        name: "Colorado",
        vehicleType: "CAR",
        variants: [{ id: "local:chevrolet:colorado-ltz", code: "COLORADO_LTZ", name: "LTZ" }],
      },
      {
        id: "local:chevrolet:trailblazer",
        code: "TRAILBLAZER",
        name: "Trailblazer",
        vehicleType: "CAR",
        variants: [{ id: "local:chevrolet:trailblazer-ltz", code: "TRAILBLAZER_LTZ", name: "LTZ" }],
      },
    ],
  },
];

/** Bổ sung phiên bản phổ biến khi API chưa có variant. */
const localVariantExtras: Record<string, CatalogVariant[]> = {
  // Toyota Camry
  "6ae372ab680c22d12a2fedb2": [
    { id: trackLocalId("local:camry:25g"), code: "CAMRY_G", name: "2.5G" },
    { id: trackLocalId("local:camry:25hv"), code: "CAMRY_HV", name: "2.5HV" },
  ],
  // Toyota Fortuner
  "6ae372ab680c22d12a2fedd1": [
    { id: trackLocalId("local:fortuner:28"), code: "FORTUNER_28", name: "2.8" },
  ],
  // Toyota Innova
  "6ae372ab680c22d12a2fede8": [
    { id: trackLocalId("local:innova:g"), code: "INNOVA_G", name: "G" },
    { id: trackLocalId("local:innova:v"), code: "INNOVA_V", name: "V" },
  ],
  // Hyundai Accent
  "6ae372ab680c22d12a2fee0e": [
    { id: trackLocalId("local:accent:at"), code: "ACCENT_AT", name: "1.4 AT" },
    { id: trackLocalId("local:accent:mt"), code: "ACCENT_MT", name: "1.4 MT" },
  ],
  // Hyundai Tucson
  "6ae372ab680c22d12a2fee10": [
    { id: trackLocalId("local:tucson:special"), code: "TUCSON_SPECIAL", name: "Special" },
    { id: trackLocalId("local:tucson:premium"), code: "TUCSON_PREMIUM", name: "Premium" },
  ],
  // Ford Everest
  "6ae372ab680c22d12a2fee39": [
    { id: trackLocalId("local:everest:titanium"), code: "EVEREST_TI", name: "Titanium" },
    { id: trackLocalId("local:everest:sport"), code: "EVEREST_SPORT", name: "Sport" },
  ],
  // Mazda CX-5
  "6ae372ab680c22d12a2fee2a": [
    { id: trackLocalId("local:cx5:deluxe"), code: "CX5_DELUXE", name: "Deluxe" },
    { id: trackLocalId("local:cx5:luxury"), code: "CX5_LUXURY", name: "Luxury" },
    { id: trackLocalId("local:cx5:signature"), code: "CX5_SIGNATURE", name: "Signature" },
  ],
  // Honda CR-V
  "6ae372ab680c22d12a2fedfd": [
    { id: trackLocalId("local:crv:g"), code: "CRV_G", name: "G" },
    { id: trackLocalId("local:crv:l"), code: "CRV_L", name: "L" },
    { id: trackLocalId("local:crv:rs"), code: "CRV_RS", name: "RS" },
  ],
  // VinFast VF 5
  "6ae372ab680c22d12a2fee3e": [
    { id: trackLocalId("local:vf5:plus"), code: "VF5_PLUS", name: "Plus" },
  ],
};

function asBrand(raw: unknown): CatalogBrand | null {
  const row = raw as CatalogBrand;
  if (!row?.id || !row?.name) return null;
  return {
    id: String(row.id),
    code: String(row.code || row.name).toUpperCase(),
    name: String(row.name),
    vehicleTypes: Array.isArray(row.vehicleTypes) ? row.vehicleTypes : ["CAR"],
    models: Array.isArray(row.models)
      ? row.models.map((model) => ({
          id: String(model.id),
          code: String(model.code || model.name),
          name: String(model.name),
          vehicleType: model.vehicleType || null,
          variants: Array.isArray(model.variants)
            ? model.variants.map((variant) => ({
                id: String(variant.id),
                code: String(variant.code || variant.name),
                name: String(variant.name),
              }))
            : [],
        }))
      : [],
  };
}

function mergeVariants(base: CatalogVariant[], extra: CatalogVariant[]) {
  const map = new Map<string, CatalogVariant>();
  for (const item of [...base, ...extra]) {
    const key = item.id || item.code || item.name;
    if (!map.has(key)) map.set(key, item);
  }
  return Array.from(map.values());
}

function enrichBrand(brand: CatalogBrand): CatalogBrand {
  return {
    ...brand,
    models: brand.models.map((model) => ({
      ...model,
      variants: mergeVariants(model.variants, localVariantExtras[model.id] || []),
    })),
  };
}

/** Catalog đầy đủ để chọn trên form (API snapshot + bổ sung FE). */
export const VEHICLE_CATALOG: CatalogBrand[] = [
  ...(apiSnapshot as CatalogBrand[])
    .map((item) => enrichBrand(asBrand(item)!))
    .filter(Boolean),
  ...localExtras.map(mapLocalBrand),
].sort((a, b) => a.name.localeCompare(b.name, "vi"));

export function getCatalogBrands(vehicleType?: string): CatalogBrand[] {
  if (!vehicleType) return VEHICLE_CATALOG;
  return VEHICLE_CATALOG.filter((brand) =>
    brand.vehicleTypes.map(String).includes(String(vehicleType))
  );
}

export function getCatalogModels(
  brandId: string,
  vehicleType?: string
): CatalogModel[] {
  const normalized = toCatalogObjectId(brandId) || brandId;
  const brand =
    VEHICLE_CATALOG.find((item) => item.id === brandId) ||
    VEHICLE_CATALOG.find((item) => item.id === normalized);
  if (!brand) return [];
  if (!vehicleType) return brand.models;
  return brand.models.filter(
    (model) =>
      !model.vehicleType || String(model.vehicleType) === String(vehicleType)
  );
}

export function getCatalogVariants(modelId: string): CatalogVariant[] {
  const normalized = toCatalogObjectId(modelId) || modelId;
  for (const brand of VEHICLE_CATALOG) {
    const model =
      brand.models.find((item) => item.id === modelId) ||
      brand.models.find((item) => item.id === normalized);
    if (model) return model.variants;
  }
  return [];
}

export function findCatalogLabel(
  type: "brand" | "model" | "variant",
  id?: string
) {
  if (!id) return "";
  const normalized = toCatalogObjectId(id);
  if (type === "brand") {
    return (
      VEHICLE_CATALOG.find((item) => item.id === id || item.id === normalized)
        ?.name || ""
    );
  }
  if (type === "model") {
    for (const brand of VEHICLE_CATALOG) {
      const model = brand.models.find(
        (item) => item.id === id || item.id === normalized
      );
      if (model) return model.name;
    }
  }
  if (type === "variant") {
    for (const brand of VEHICLE_CATALOG) {
      for (const model of brand.models) {
        const variant = model.variants.find(
          (item) => item.id === id || item.id === normalized
        );
        if (variant) return variant.name;
      }
    }
  }
  return "";
}

/** Id brand/model thật đầu tiên trên server theo loại xe (fallback khi server validate catalog). */
export function getServerCatalogFallback(vehicleType?: string) {
  const brands = getCatalogBrands(vehicleType).filter(
    (brand) => !isLocalCatalogId(brand.id)
  );
  for (const brand of brands) {
    const model = brand.models.find(
      (item) =>
        !isLocalCatalogId(item.id) &&
        (!item.vehicleType ||
          !vehicleType ||
          String(item.vehicleType) === String(vehicleType))
    );
    if (model) {
      return {
        brandId: brand.id,
        modelId: model.id,
        variantId: model.variants.find((item) => !isLocalCatalogId(item.id))
          ?.id,
      };
    }
  }
  return null;
}

/**
 * Chuẩn hóa brand/model/variant để ghi API.
 * Server chỉ nhận id có trong vehicle-catalog → hãng FE/local/custom
 * sẽ map sang id server hợp lệ, vẫn giữ brandName/modelName đã chọn.
 */
export function resolveCatalogWriteIds(input: {
  brandId?: string;
  modelId?: string;
  variantId?: string;
  vehicleType?: string;
  brandLabel?: string;
  modelLabel?: string;
  variantLabel?: string;
}) {
  const brandIdRaw = String(input.brandId || "").trim();
  const modelIdRaw = String(input.modelId || "").trim();
  const variantIdRaw = String(input.variantId || "").trim();
  const vehicleType = String(input.vehicleType || "CAR");

  const brandName =
    input.brandLabel ||
    findCatalogLabel("brand", brandIdRaw) ||
    brandIdRaw;
  const modelName =
    input.modelLabel ||
    findCatalogLabel("model", modelIdRaw) ||
    modelIdRaw;
  const variantName =
    input.variantLabel ||
    findCatalogLabel("variant", variantIdRaw) ||
    variantIdRaw;

  let brandId =
    brandIdRaw && !isLocalCatalogId(brandIdRaw) ? brandIdRaw : "";
  let modelId =
    modelIdRaw && !isLocalCatalogId(modelIdRaw) ? modelIdRaw : "";
  let variantId =
    variantIdRaw && !isLocalCatalogId(variantIdRaw) ? variantIdRaw : "";

  // Hãng server thật nhưng dòng là local → lấy dòng server đầu tiên của hãng đó
  if (brandId && !modelId) {
    const serverModel = getCatalogModels(brandId, vehicleType).find(
      (item) => !isLocalCatalogId(item.id)
    );
    if (serverModel) modelId = serverModel.id;
  }

  // Vẫn thiếu → fallback catalog server theo loại xe
  if (!brandId || !modelId) {
    const fallback = getServerCatalogFallback(vehicleType);
    if (fallback) {
      if (!brandId) brandId = fallback.brandId;
      if (!modelId) modelId = fallback.modelId;
      if (!variantId && fallback.variantId) variantId = fallback.variantId;
    }
  }

  // Variant local dưới model server → bỏ hoặc lấy variant server đầu tiên
  if (!variantId && modelId) {
    const serverVariant = getCatalogVariants(modelId).find(
      (item) => !isLocalCatalogId(item.id)
    );
    if (serverVariant) variantId = serverVariant.id;
  }

  return {
    brandId,
    modelId,
    variantId: variantId || undefined,
    brandName,
    modelName,
    variantName: variantName || undefined,
    usedServerFallback:
      Boolean(brandIdRaw && isLocalCatalogId(brandIdRaw)) ||
      Boolean(modelIdRaw && isLocalCatalogId(modelIdRaw)),
  };
}

export function registerCustomCatalogOption(
  type: "brand" | "model" | "variant",
  name: string,
  parent?: { brandId?: string; modelId?: string; vehicleType?: string }
) {
  const label = String(name || "").trim();
  if (!label) return null;
  const key =
    type === "brand"
      ? `custom:brand:${label.toLowerCase()}`
      : type === "model"
        ? `custom:model:${parent?.brandId || "x"}:${label.toLowerCase()}`
        : `custom:variant:${parent?.modelId || "x"}:${label.toLowerCase()}`;
  const id = trackLocalId(key);
  return { id, label, key };
}

/** Gộp danh sách API với catalog local (ưu tiên bản ghi API cùng id). */
export function mergeCatalogRows(
  apiItems: unknown[],
  localItems: Array<{ id: string; name: string; code?: string; [key: string]: unknown }>
) {
  const map = new Map<string, Record<string, unknown>>();
  for (const item of localItems) {
    map.set(item.id, {
      _id: item.id,
      id: item.id,
      name: item.name,
      code: item.code,
      ...item,
    });
  }
  for (const raw of apiItems) {
    const row = (raw || {}) as Record<string, unknown>;
    const id = String(row._id || row.id || "");
    if (!id) continue;
    map.set(id, { ...map.get(id), ...row, _id: id, id });
  }
  return Array.from(map.values()).sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || ""), "vi")
  );
}
