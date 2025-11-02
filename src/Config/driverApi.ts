import api from "./api";

export interface DriverApplicationData {
  personal?: {
    fullName: string;
    phone: string;
    email: string;
    idNumber: string;
    gender?: "Nam" | "Nữ";
  };
  address?: {
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
  };
  documents?: {
    idFrontUrl: string;
    idBackUrl: string;
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
  };
  licenseNumber?: string;
  licenseExpiry?: string; // YYYY-MM-DD format
  yearsExperience?: number;
  services?: string[];
  applicationId?: string; // For updating existing draft
}

export interface DriverApplicationResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    status: string;
    [key: string]: any;
  };
}

export interface UploadDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    idFrontUrl: string;
    idBackUrl: string;
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
  };
}

// Upload documents to Cloudinary
export const uploadDocuments = async (
  documents: {
    idFront?: File;
    idBack?: File;
    driverLicenseFront?: File;
    driverLicenseBack?: File;
  }
): Promise<UploadDocumentsResponse> => {
  const formData = new FormData();

  if (documents.idFront) {
    formData.append("idFront", documents.idFront);
  }
  if (documents.idBack) {
    formData.append("idBack", documents.idBack);
  }
  if (documents.driverLicenseFront) {
    formData.append("driverLicenseFront", documents.driverLicenseFront);
  }
  if (documents.driverLicenseBack) {
    formData.append("driverLicenseBack", documents.driverLicenseBack);
  }

  const hasFiles =
    documents.idFront ||
    documents.idBack ||
    documents.driverLicenseFront ||
    documents.driverLicenseBack;

  if (!hasFiles) {
    throw new Error("Không có tài liệu nào để tải lên.");
  }

  const response = await api.post("/upload/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Create or update draft application
export const saveDraftApplication = async (
  applicationData: DriverApplicationData
): Promise<DriverApplicationResponse> => {
  const response = await api.post("/driver/applications", applicationData);
  return response.data;
};

// Update existing application
export const updateDriverApplication = async (
  applicationId: string,
  applicationData: Partial<DriverApplicationData>
): Promise<DriverApplicationResponse> => {
  const response = await api.patch(
    `/driver/applications/${applicationId}`,
    applicationData
  );
  return response.data;
};

// Get my applications
export const getMyDriverApplications = async (): Promise<{
  success: boolean;
  message: string;
  data: any[];
}> => {
  const response = await api.get("/driver/applications/me");
  return response.data;
};

// Submit application for review
export const submitDriverApplication = async (
  applicationId: string
): Promise<DriverApplicationResponse> => {
  const response = await api.post(
    `/driver/applications/${applicationId}/submit`
  );
  return response.data;
};

// Get application by ID
export const getDriverApplicationById = async (
  applicationId: string
): Promise<DriverApplicationResponse> => {
  const response = await api.get(`/driver/applications/${applicationId}`);
  return response.data;
};

