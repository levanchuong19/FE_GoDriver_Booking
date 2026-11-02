export interface RideCategory {
  code: string;
  name?: string;
  displayName?: string;
  baseFare?: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumFare?: number;
  platformFee?: number;
  active?: boolean;
  [key: string]: unknown;
}

export interface RideRecord {
  id?: string;
  _id?: string;
  rideCode?: string;
  status?: string;
  categoryCode?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  fare?: number;
  price?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  customer?: { fullName?: string; phone?: string; email?: string };
  customerId?: { fullName?: string; phone?: string; email?: string } | string;
  driver?: { fullName?: string; phone?: string };
  driverId?: { fullName?: string; phone?: string } | string;
  statusHistory?: Array<Record<string, unknown>>;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export function getRideId(item: RideRecord) {
  return item.id || item._id || item.rideCode || "";
}
