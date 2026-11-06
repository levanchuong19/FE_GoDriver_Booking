import api from "./api";

export type DriverCapabilityType = "DRIVER_FOR_HIRE" | "RIDE_HAILING";

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
    idVneidUrl?: string;
    portraitUrl?: string;
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
    idFrontUrl?: string;
    idBackUrl?: string;
    idVneidUrl?: string;
    portraitUrl?: string;
    driverLicenseFrontUrl?: string;
    driverLicenseBackUrl?: string;
  };
}

export interface UploadVehicleDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    registrationUrl?: string;
    inspectionUrl?: string;
    insuranceUrl?: string;
    vehiclePhotoUrl?: string;
    platePhotoUrl?: string;
    [key: string]: string | undefined;
  };
}

export interface RideVehiclePayload {
  categoryCode: string;
  seatCount: number;
  brand?: string;
  make?: string;
  model?: string;
  color?: string;
  vehicleColor?: string;
  plate?: string;
  licensePlate?: string;
  energyType?: string;
  manufactureYear?: number;
  documents?: Record<string, string>;
}

// Upload documents to Cloudinary
export const uploadDocuments = async (documents: {
  idFront?: File;
  idBack?: File;
  idVneid?: File;
  portrait?: File;
  driverLicenseFront?: File;
  driverLicenseBack?: File;
}): Promise<UploadDocumentsResponse> => {
  const formData = new FormData();

  if (documents.idFront) formData.append("idFront", documents.idFront);
  if (documents.idBack) formData.append("idBack", documents.idBack);
  if (documents.idVneid) formData.append("idVneid", documents.idVneid);
  if (documents.portrait) formData.append("portrait", documents.portrait);
  if (documents.driverLicenseFront) {
    formData.append("driverLicenseFront", documents.driverLicenseFront);
  }
  if (documents.driverLicenseBack) {
    formData.append("driverLicenseBack", documents.driverLicenseBack);
  }

  const hasFiles =
    documents.idFront ||
    documents.idBack ||
    documents.idVneid ||
    documents.portrait ||
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

export const uploadVehicleDocuments = async (documents: {
  registration?: File;
  inspection?: File;
  insurance?: File;
  vehiclePhoto?: File;
  platePhoto?: File;
}): Promise<UploadVehicleDocumentsResponse> => {
  const formData = new FormData();
  if (documents.registration) {
    formData.append("registration", documents.registration);
  }
  if (documents.inspection) {
    formData.append("inspection", documents.inspection);
  }
  if (documents.insurance) {
    formData.append("insurance", documents.insurance);
  }
  if (documents.vehiclePhoto) {
    formData.append("vehiclePhoto", documents.vehiclePhoto);
  }
  if (documents.platePhoto) {
    formData.append("platePhoto", documents.platePhoto);
  }

  const hasFiles = Object.values(documents).some(Boolean);
  if (!hasFiles) {
    throw new Error("Không có giấy tờ xe nào để tải lên.");
  }

  const response = await api.post("/upload/vehicle-documents", formData, {
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
  const response = await api.get("/driver/applications/me", {
    skipErrorToast: true,
  });
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

export const saveRideDriverVehicle = async (payload: RideVehiclePayload) => {
  const response = await api.post("/rides/driver/vehicle", payload);
  return response.data;
};

export const submitRideDriverRegistration = async () => {
  const response = await api.post("/rides/driver/registration/submit");
  return response.data;
};

export const getRideCategories = async () => {
  const response = await api.get("/rides/categories", {
    skipErrorToast: true,
  });
  return response.data;
};
