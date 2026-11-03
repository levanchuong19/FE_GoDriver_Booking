import axios from "axios";
import api from "./api";
import { unwrapData, unwrapList } from "../Utils/apiData";
import { normalizeUsedCarDetail } from "../Utils/normalizeUsedCar";
import type { RideDriverRegistration } from "../models/RideDriver";

async function requestRideDriver(
  method: "get" | "post",
  path: string,
  payload?: unknown,
  params?: Record<string, unknown>
) {
  try {
    return await api.request({
      method,
      url: `/admin/ride-driver-registrations${path}`,
      data: payload,
      params,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return await api.request({
        method,
        url: `/rides/admin/ride-drivers${path}`,
        data: payload,
        params,
      });
    }
    throw error;
  }
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function pickStatus(...values: unknown[]) {
  return pickString(...values).toLowerCase();
}

export function normalizeRideDriver(raw: unknown): RideDriverRegistration {
  const item = (raw ?? {}) as Record<string, unknown>;
  const user = (item.user ?? {}) as Record<string, unknown>;
  const kyc = (item.kyc ??
    item.application ??
    item.driverApplication ??
    {}) as Record<string, unknown>;
  const personal = (kyc.personal ?? item.personal ?? {}) as Record<
    string,
    unknown
  >;
  const vehicle = (item.vehicle ??
    item.rideVehicle ??
    {}) as RideDriverRegistration["vehicle"];
  const capabilities = (item.capabilities ?? {}) as Record<string, unknown>;

  const userId = pickString(
    item.userId,
    user._id,
    user.id,
    item._id,
    item.id
  );

  return {
    userId,
    status: pickStatus(
      item.rideHailingStatus,
      item.rideStatus,
      capabilities.RIDE_HAILING,
      item.status,
      kyc.status
    ),
    kycStatus: pickStatus(kyc.status, item.kycStatus),
    fullName: pickString(
      personal.fullName,
      user.fullName,
      item.fullName,
      item.name
    ),
    email: pickString(personal.email, user.email, item.email),
    phone: pickString(personal.phone, user.phone, item.phone),
    createdAt: pickString(
      item.createdAt,
      item.submittedAt,
      kyc.submittedAt,
      kyc.createdAt
    ),
    vehicle,
    kyc,
    user,
    capabilities,
    rejectionReason: pickString(
      item.rejectionReason,
      item.reason,
      item.rejectReason
    ),
    raw: item,
  };
}

export async function listRideDriverRegistrations(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const res = await requestRideDriver("get", "", undefined, params);
  const { items, total, page, limit } = unwrapList(res.data);
  return {
    items: items.map(normalizeRideDriver),
    total,
    page,
    limit,
  };
}

export async function getRideDriverRegistration(userId: string) {
  const res = await requestRideDriver("get", `/${userId}`);
  return normalizeRideDriver(unwrapData(res.data) ?? res.data);
}

export async function approveRideDriverRegistration(userId: string) {
  const res = await requestRideDriver("post", `/${userId}/approve`);
  return unwrapData(res.data);
}

export async function rejectRideDriverRegistration(
  userId: string,
  reason: string
) {
  const res = await requestRideDriver("post", `/${userId}/reject`, { reason });
  return unwrapData(res.data);
}

export async function approveWithdrawRequest(requestId: string) {
  const res = await api.post(`/admin/withdraw-requests/${requestId}/approve`);
  return unwrapData(res.data);
}

export async function rejectWithdrawRequest(
  requestId: string,
  message: string
) {
  const res = await api.post(`/admin/withdraw-requests/${requestId}/reject`, {
    message,
  });
  return unwrapData(res.data);
}

export async function getOnlineDriverCount() {
  const res = await api.get("/driver/online/count");
  const raw = res.data as { count?: number; data?: { count?: number } };
  return Number(raw?.count ?? raw?.data?.count ?? 0);
}

export async function getOnlineDrivers() {
  const res = await api.get("/driver/online/list");
  const data = unwrapData(res.data) as { drivers?: unknown[] } | unknown[];
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.drivers)) {
    return data.drivers;
  }
  const root = res.data as { drivers?: unknown[] };
  return Array.isArray(root?.drivers) ? root.drivers : [];
}

export async function getDriverWallet(driverId: string) {
  const res = await api.get(`/driver/wallet/${driverId}`);
  return unwrapData(res.data) ?? res.data;
}

export async function listUsedCars(params?: {
  status?: string;
  sellerId?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/admin/used-cars", { params });
  return unwrapList(res.data);
}

export async function getUsedCar(id: string) {
  try {
    const res = await api.get(`/admin/used-cars/${id}`);
    return normalizeUsedCarDetail(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const res = await api.get(`/used-cars/${id}`);
      return normalizeUsedCarDetail(res.data);
    }
    throw error;
  }
}

export async function createUsedCar(payload: Record<string, unknown>) {
  const res = await api.post("/used-cars", payload);
  return unwrapData(res.data) ?? res.data;
}

export async function updateUsedCar(
  id: string,
  payload: Record<string, unknown>
) {
  const res = await api.patch(`/used-cars/${id}`, payload);
  return unwrapData(res.data) ?? res.data;
}

export async function deleteUsedCar(id: string) {
  const res = await api.delete(`/used-cars/${id}`);
  return unwrapData(res.data) ?? res.data;
}

export async function submitUsedCar(id: string) {
  const res = await api.post(`/used-cars/${id}/submit`);
  return unwrapData(res.data) ?? res.data;
}

export async function markUsedCarSold(id: string) {
  const res = await api.post(`/used-cars/${id}/sold`);
  return unwrapData(res.data) ?? res.data;
}

export async function uploadUsedCarMedia(id: string, file: File | Blob, filename = "image.jpg") {
  const formData = new FormData();
  formData.append("file", file, filename);
  const res = await api.post(`/used-cars/${id}/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapData(res.data) ?? res.data;
}

export async function deleteUsedCarMedia(id: string, mediaId: string) {
  const res = await api.delete(`/used-cars/${id}/media/${mediaId}`);
  return unwrapData(res.data) ?? res.data;
}

export async function setUsedCarCover(id: string, mediaId: string) {
  const res = await api.post(`/used-cars/${id}/media/${mediaId}/cover`);
  return unwrapData(res.data) ?? res.data;
}

export async function approveUsedCar(id: string) {
  const res = await api.post(`/admin/used-cars/${id}/approve`);
  return unwrapData(res.data);
}

export async function rejectUsedCar(id: string, reason: string) {
  const res = await api.post(`/admin/used-cars/${id}/reject`, { reason });
  return unwrapData(res.data);
}

export async function hideUsedCar(id: string, reason: string) {
  const res = await api.post(`/admin/used-cars/${id}/hide`, { reason });
  return unwrapData(res.data);
}

export async function listUsedCarReports(params?: { status?: string }) {
  const res = await api.get("/admin/used-car-reports", { params });
  return unwrapList(res.data);
}

export async function resolveUsedCarReport(
  id: string,
  payload: { dismiss?: boolean; adminNote?: string }
) {
  const res = await api.post(`/admin/used-car-reports/${id}/resolve`, payload);
  return unwrapData(res.data);
}

export async function listAdminRides(params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const res = await api.get("/rides/admin/rides", { params });
  return unwrapList(res.data);
}

export async function getAdminRide(id: string) {
  const res = await api.get(`/rides/admin/rides/${id}`);
  return unwrapData(res.data) ?? res.data;
}

export async function listRideCategories() {
  const res = await api.get("/rides/categories");
  const parsed = unwrapList(res.data);
  if (parsed.items.length) return parsed.items;
  const data = unwrapData(res.data);
  return Array.isArray(data) ? data : [];
}

export async function updateRideCategory(
  code: string,
  payload: Record<string, unknown>
) {
  const res = await api.patch(`/rides/admin/categories/${code}`, payload);
  return unwrapData(res.data);
}

export async function updateBookingStatus(id: string, status: string) {
  const res = await api.patch(`/bookings/updateStatus/${id}`, { status });
  return unwrapData(res.data);
}

export async function updateBookingPaymentStatus(
  id: string,
  paymentStatus: string
) {
  const res = await api.patch(`/bookings/updatePaymentStatus/${id}`, {
    paymentStatus,
  });
  return unwrapData(res.data);
}
