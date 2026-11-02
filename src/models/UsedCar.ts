export type UsedCarStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "HIDDEN"
  | "SOLD"
  | "EXPIRED"
  | "ARCHIVED"
  | string;

export interface UsedCarMedia {
  _id?: string;
  id?: string;
  url?: string;
  type?: string;
  isCover?: boolean;
}

export interface UsedCarListing {
  id?: string;
  _id?: string;
  vehicleType?: string;
  title?: string;
  description?: string;
  manufactureYear?: number;
  mileage?: number;
  price?: number;
  negotiable?: boolean;
  transmission?: string;
  fuelType?: string;
  condition?: string;
  status?: UsedCarStatus;
  viewsCount?: number;
  favoritesCount?: number;
  contactsCount?: number;
  media?: UsedCarMedia[];
  features?: string[];
  contactName?: string;
  contactPhone?: string;
  plateNumber?: string;
  exteriorColor?: string;
  interiorColor?: string;
  bodyType?: string;
  sellerId?: string | { _id?: string; fullName?: string; phone?: string };
  createdAt?: string;
  updatedAt?: string;
  statusHistory?: Array<Record<string, unknown>>;
  moderationLogs?: Array<Record<string, unknown>>;
  rejectionReason?: string;
}

export interface UsedCarReport {
  id?: string;
  _id?: string;
  listingId?: string | UsedCarListing;
  reason?: string;
  description?: string;
  status?: "OPEN" | "RESOLVED" | "DISMISSED" | string;
  reporterId?: string | { fullName?: string; phone?: string };
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function getUsedCarId(item: { id?: string; _id?: string }) {
  return item.id || item._id || "";
}
