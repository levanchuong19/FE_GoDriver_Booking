export type RideDriverStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | string;

export interface RideVehicle {
  _id?: string;
  categoryCode?: string;
  plateNumber?: string;
  licensePlate?: string;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  verified?: boolean;
  photos?: string[];
  documents?: Record<string, string | undefined>;
}

export interface RideDriverRegistration {
  userId: string;
  status: RideDriverStatus;
  kycStatus?: RideDriverStatus;
  fullName?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  vehicle?: RideVehicle;
  kyc?: Record<string, unknown>;
  user?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  rejectionReason?: string;
  raw: Record<string, unknown>;
}
