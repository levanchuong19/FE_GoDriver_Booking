export interface OnlineDriver {
  driverId: string;
  lat?: number;
  lng?: number;
  lastSeen?: string;
  fullName?: string;
  phone?: string;
  availability?: string;
}

export interface DriverWalletInfo {
  _id?: string;
  driver?: string;
  balance?: number;
  debt?: number;
  totalEarnings?: number;
  totalWithdrawn?: number;
  isLocked?: boolean;
  lockReason?: string | null;
  bankAccount?: {
    numberBank?: string;
    bankName?: string;
  };
}
