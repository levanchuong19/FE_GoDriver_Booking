import {
  approveUsedCar,
  createUsedCar,
  submitUsedCar,
  uploadUsedCarMedia,
} from "../Config/adminApi";
import {
  resolveCatalogWriteIds,
  toCatalogObjectId,
} from "../data/vehicleCatalog";
import { getUsedCarId } from "../models/UsedCar";
import { MERCEDES_S450_SEED } from "../models/UsedCarWrite";

async function urlToFile(path: string, filename: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Không tải được ảnh ${path}`);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export async function seedMercedesS450Listing(options?: {
  autoApprove?: boolean;
  autoSubmit?: boolean;
}) {
  const catalog = resolveCatalogWriteIds({
    brandId: toCatalogObjectId("local:mercedes"),
    modelId: toCatalogObjectId("local:mercedes:s-class"),
    variantId: toCatalogObjectId("local:mercedes:s450"),
    vehicleType: MERCEDES_S450_SEED.vehicleType,
  });

  const payload: Record<string, unknown> = {
    vehicleType: MERCEDES_S450_SEED.vehicleType,
    title: MERCEDES_S450_SEED.title,
    description: MERCEDES_S450_SEED.description,
    manufactureYear: MERCEDES_S450_SEED.manufactureYear,
    mileage: MERCEDES_S450_SEED.mileage,
    price: MERCEDES_S450_SEED.price > 0 ? MERCEDES_S450_SEED.price : 1_850_000_000,
    negotiable: MERCEDES_S450_SEED.negotiable,
    transmission: MERCEDES_S450_SEED.transmission,
    fuelType: MERCEDES_S450_SEED.fuelType,
    bodyType: MERCEDES_S450_SEED.bodyType,
    condition: MERCEDES_S450_SEED.condition,
    exteriorColor: MERCEDES_S450_SEED.exteriorColor,
    interiorColor: MERCEDES_S450_SEED.interiorColor,
    provinceCode: "79",
    districtCode: "760",
    contactName: "SmartDrive Admin",
    contactPhone: "0901234567",
    brandId: catalog.brandId,
    modelId: catalog.modelId,
    variantId: catalog.variantId,
    brandName: catalog.brandName,
    modelName: catalog.modelName,
    variantName: catalog.variantName,
    features: [],
  };

  const created = (await createUsedCar(payload)) as {
    id?: string;
    _id?: string;
  };

  const id = getUsedCarId(created);
  if (!id) throw new Error("API không trả về id tin vừa tạo");

  for (let i = 0; i < MERCEDES_S450_SEED.imagePaths.length; i += 1) {
    const path = MERCEDES_S450_SEED.imagePaths[i];
    const file = await urlToFile(path, `s450-${i + 1}.jpg`);
    await uploadUsedCarMedia(id, file, file.name);
  }

  if (options?.autoSubmit !== false) {
    await submitUsedCar(id);
  }

  if (options?.autoApprove) {
    await approveUsedCar(id);
  }

  return id;
}
