import api from "./api";
import { unwrapData, unwrapList } from "../Utils/apiData";

function asList(raw: unknown) {
  const parsed = unwrapList(raw);
  if (parsed.items.length) return parsed;
  const data = unwrapData(raw);
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of [
      "bookings",
      "trips",
      "vehicles",
      "plans",
      "brands",
      "models",
      "variants",
      "templates",
      "notifications",
      "messages",
      "history",
    ]) {
      if (Array.isArray(obj[key])) {
        return {
          items: obj[key] as unknown[],
          total: Number(obj.count ?? obj.total ?? (obj[key] as unknown[]).length),
        };
      }
    }
  }
  return parsed;
}

/** Shared rides */
export async function searchSharedTrips(params: {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  date: string;
  passengerCount?: number;
}) {
  const res = await api.get("/shared-rides/search", { params });
  return asList(res.data);
}

export async function getSharedTrip(tripId: string) {
  const res = await api.get(`/shared-rides/trips/${tripId}`);
  return unwrapData(res.data) ?? res.data;
}

export async function getSharedTripDashboard(tripId: string) {
  const res = await api.get(`/shared-rides/trips/${tripId}/dashboard`);
  return unwrapData(res.data) ?? res.data;
}

export async function getSharedTripManifest(tripId: string) {
  const res = await api.get(`/shared-rides/trips/${tripId}/manifest`);
  return unwrapData(res.data) ?? res.data;
}

export async function listSharedTripsMine() {
  const res = await api.get("/shared-rides/trips");
  return asList(res.data);
}

export async function listSharedVehiclesMine() {
  const res = await api.get("/shared-rides/vehicles");
  return asList(res.data);
}

export async function listSeatTemplates() {
  const res = await api.get("/shared-rides/seat-templates");
  return asList(res.data);
}

export async function publishSharedTrip(tripId: string) {
  const res = await api.post(`/shared-rides/trips/${tripId}/publish`);
  return unwrapData(res.data);
}

export async function startSharedTrip(tripId: string) {
  const res = await api.post(`/shared-rides/trips/${tripId}/start`);
  return unwrapData(res.data);
}

export async function completeSharedTrip(tripId: string) {
  const res = await api.post(`/shared-rides/trips/${tripId}/complete`);
  return unwrapData(res.data);
}

export async function cancelSharedTrip(tripId: string) {
  const res = await api.post(`/shared-rides/trips/${tripId}/cancel`);
  return unwrapData(res.data);
}

export async function quoteSharedCharter(payload: Record<string, unknown>) {
  const res = await api.post("/shared-rides/charters/quote", payload);
  return unwrapData(res.data) ?? res.data;
}

export async function createSharedCharter(payload: Record<string, unknown>) {
  const res = await api.post("/shared-rides/charters", payload);
  return unwrapData(res.data) ?? res.data;
}

export async function getSharedBooking(bookingId: string) {
  const res = await api.get(`/shared-rides/bookings/${bookingId}`);
  return unwrapData(res.data) ?? res.data;
}

/** Self drive */
export async function searchSelfDriveVehicles(params: Record<string, unknown>) {
  const res = await api.get("/self-drive/search", { params });
  return asList(res.data);
}

export async function listSelfDriveVehiclesMine() {
  const res = await api.get("/self-drive/vehicles");
  return asList(res.data);
}

export async function quoteSelfDriveVehicle(
  vehicleId: string,
  payload: Record<string, unknown>
) {
  const res = await api.post(`/self-drive/vehicles/${vehicleId}/quote`, payload);
  return unwrapData(res.data) ?? res.data;
}

export async function createSelfDriveBooking(payload: Record<string, unknown>) {
  const res = await api.post("/self-drive/bookings", payload);
  return unwrapData(res.data) ?? res.data;
}

/** Pricing engine */
export async function listPricingPlans() {
  const res = await api.get("/pricing/plans");
  return asList(res.data);
}

export async function createPricingPlan(payload: Record<string, unknown>) {
  const res = await api.post("/pricing/plans", payload);
  return unwrapData(res.data) ?? res.data;
}

export async function createPricingQuote(payload: {
  service: string;
  context?: Record<string, unknown>;
}) {
  const res = await api.post("/pricing/quote", payload);
  return unwrapData(res.data) ?? res.data;
}

/** Vehicle catalog */
export async function listVehicleBrands(params?: {
  keyword?: string;
  vehicleType?: string;
}) {
  const res = await api.get("/vehicle-catalog/brands", { params });
  return asList(res.data);
}

export async function listVehicleModels(params: {
  brandId: string;
  keyword?: string;
  vehicleType?: string;
}) {
  const res = await api.get("/vehicle-catalog/models", { params });
  return asList(res.data);
}

export async function listVehicleVariants(params: {
  modelId: string;
  keyword?: string;
}) {
  const res = await api.get("/vehicle-catalog/variants", { params });
  return asList(res.data);
}

/** Chat */
export async function listChatBookings() {
  const res = await api.get("/chat/bookings");
  return asList(res.data);
}

export async function getChatUnreadCount() {
  const res = await api.get("/chat/unread-count");
  const data = unwrapData(res.data) as { unreadCount?: number } | undefined;
  return Number(
    data?.unreadCount ??
      (res.data as { unreadCount?: number })?.unreadCount ??
      0
  );
}

export async function getChatMessages(bookingId: string) {
  const res = await api.get(`/chat/${bookingId}/messages`);
  return asList(res.data);
}

export async function sendChatMessage(bookingId: string, message: string) {
  const res = await api.post(`/chat/${bookingId}/send`, { message });
  return unwrapData(res.data) ?? res.data;
}

export async function markChatRead(bookingId: string) {
  const res = await api.post(`/chat/${bookingId}/mark-read`);
  return unwrapData(res.data);
}

/** Chatbot */
export async function sendChatbotMessage(message: string, sessionId: string) {
  const res = await api.post("/chatbot/chat", { message, sessionId });
  return unwrapData(res.data) ?? res.data;
}

export async function getChatbotHistory(sessionId: string) {
  const res = await api.get(`/chatbot/history/${sessionId}`);
  return unwrapData(res.data) ?? res.data;
}

export async function clearChatbotHistory(sessionId: string) {
  const res = await api.post("/chatbot/clear-history", { sessionId });
  return unwrapData(res.data);
}

/** Notifications */
export async function listNotifications(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/notifications/get-all", { params });
  return asList(res.data);
}

export async function markNotificationRead(id: string) {
  const res = await api.put(`/notifications/${id}/read`);
  return unwrapData(res.data);
}

export async function markAllNotificationsRead() {
  const res = await api.put("/notifications/read-all");
  return unwrapData(res.data);
}

export async function deleteNotification(id: string) {
  const res = await api.delete(`/notifications/${id}`);
  return unwrapData(res.data);
}

/** Driver wallet transactions */
export async function listDriverWalletTransactions(
  driverId: string,
  type: "booking_income" | "withdraw",
  params?: { page?: number; limit?: number }
) {
  const res = await api.get(
    `/driver/wallet/${driverId}/transactions/${type}`,
    { params }
  );
  return unwrapList(res.data);
}
