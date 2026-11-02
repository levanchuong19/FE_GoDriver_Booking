export interface WithdrawRequestInfo {
  _id?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  adminNote?: string | null;
  bankInfo?: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
  };
}

export interface Transaction {
  id: string;
  _id?: string;
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
  withdrawRequestId?: string | null;
  withdrawRequest?: WithdrawRequestInfo | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

const SETTLED_WITHDRAW_STATUSES = [
  "approved",
  "rejected",
  "paid",
  "completed",
  "success",
  "cancelled",
  "canceled",
];

export function getWithdrawRequestId(tx: Transaction) {
  return (
    tx.withdrawRequestId ||
    tx.withdrawRequest?._id ||
    (tx.type === "withdraw" ? tx.id || tx._id : undefined) ||
    undefined
  );
}

export function isWithdrawActionable(tx: Transaction) {
  if (tx.type !== "withdraw") return false;
  const status = (tx.withdrawStatus || tx.withdrawRequest?.status || "").toLowerCase();
  if (!status) return true;
  return !SETTLED_WITHDRAW_STATUSES.includes(status);
}

