export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "user" | "staff" | "renter";
  verified?: boolean;
  avatar?: string | null;
  driverProfileId?: string | null;
  savedAddresses?: string[];
  paymentMethods?: string[];
  createdAt?: string;
  updatedAt?: string;
  gender?: "male" | "female" | "other";
}
