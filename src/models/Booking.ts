/** Trạng thái thanh toán */
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

/** Trạng thái chuyến/đơn */
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

/** Thông tin thanh toán gắn với đơn */
export interface Payment {
  _id?: string;
  createdAt?: string;
}

/** Khách hàng tạo đơn (renter) */
export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role?: "renter" | "driver" | "admin" | string;
  verified?: boolean;
  driverProfileId?: string | null;
  savedAddresses?: unknown[];
  paymentMethods?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/** Một bản ghi đặt xe/chuyến đi */
export interface Booking {
  _id: string;

  paymentStatus: PaymentStatus;
  payment?: Payment;

  customerId: Customer;
  driverId?: string | null;

  // thời gian & hành trình
  startTime?: string;
  endTime?: string;
  pickupLocation: string;
  dropoffLocation: string;

  // thông số chuyến
  distance?: number;
  duration?: number;
  status: BookingStatus;

  // chi phí
  price: number;

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/** Khung phân trang trong response */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Response danh sách */
export interface BookingListResponse {
  data: Booking[];
  pagination: PaginationMeta;
}

/** Response chi tiết */
export interface BookingDetailResponse {
  data: Booking;
}
