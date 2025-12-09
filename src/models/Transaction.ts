export interface Transaction {
  id: string;
  driverId: string;
  driverName: string;
  type: string;
  channel: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  bookingCode?: string | null;
  orderCode?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  withdrawStatus?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

