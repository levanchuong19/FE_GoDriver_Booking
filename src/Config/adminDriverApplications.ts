import api from "./api";

export interface ListParams {
  status?: "draft" | "pending" | "approved" | "rejected";
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  yearsMin?: number;
  yearsMax?: number;
  services?: string; // CSV
  page?: number;
  limit?: number;
}

export const listDriverApplications = async (params: ListParams) => {
  const { data } = await api.get("admin/driver-applications", { params });
  return data;
};

export const getDriverApplicationById = async (id: string) => {
  const { data } = await api.get(`admin/driver-applications/${id}`);
  return data;
};

export const approveDriverApplication = async (id: string) => {
  const { data } = await api.post(`admin/driver-applications/${id}/approve`);
  return data;
};

export const rejectDriverApplication = async (id: string, reason: string) => {
  const { data } = await api.post(`admin/driver-applications/${id}/reject`, { reason });
  return data;
};


