import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DriverCapabilityType } from "../../Config/driverApi";

interface PersonalData {
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  gender: "Nam" | "Nữ";
}

interface AddressData {
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
}

interface DriverData {
  licenseNumber: string;
  licenseExpiryDate: string; // DD/MM/YYYY format
  yearsExperience: string;
  services: string[];
  driverTypes: DriverCapabilityType[];
}

interface DocumentsData {
  idFrontUrl: string;
  idBackUrl: string;
  idVneidUrl: string;
  portraitUrl: string;
  driverLicenseFrontUrl: string;
  driverLicenseBackUrl: string;
}

interface VehicleData {
  categoryCode: string;
  seatCount: string;
  brand: string;
  model: string;
  color: string;
  plate: string;
  manufactureYear: string;
  registrationUrl: string;
  inspectionUrl: string;
  insuranceUrl: string;
  vehiclePhotoUrl: string;
  platePhotoUrl: string;
}

type DocKey = keyof DocumentsData;

interface UploadingState {
  idFrontUrl: boolean;
  idBackUrl: boolean;
  idVneidUrl: boolean;
  portraitUrl: boolean;
  driverLicenseFrontUrl: boolean;
  driverLicenseBackUrl: boolean;
}

interface UploadErrorState {
  idFrontUrl: string | null;
  idBackUrl: string | null;
  idVneidUrl: string | null;
  portraitUrl: string | null;
  driverLicenseFrontUrl: string | null;
  driverLicenseBackUrl: string | null;
}

interface Application {
  id: string;
  state: "draft" | "pending" | "approved" | "rejected";
  reason?: string;
}

interface DriverRegistrationState {
  personal: PersonalData | null;
  address: AddressData | null;
  driver: DriverData | null;
  documents: DocumentsData;
  vehicle: VehicleData;
  draftApplicationId: string | undefined;
  status: "draft" | "submitting" | "submitted" | "error";
  uploading: UploadingState;
  uploadError: UploadErrorState;
  application: Application;
}

const emptyDocuments: DocumentsData = {
  idFrontUrl: "",
  idBackUrl: "",
  idVneidUrl: "",
  portraitUrl: "",
  driverLicenseFrontUrl: "",
  driverLicenseBackUrl: "",
};

const emptyUploading: UploadingState = {
  idFrontUrl: false,
  idBackUrl: false,
  idVneidUrl: false,
  portraitUrl: false,
  driverLicenseFrontUrl: false,
  driverLicenseBackUrl: false,
};

const emptyUploadError: UploadErrorState = {
  idFrontUrl: null,
  idBackUrl: null,
  idVneidUrl: null,
  portraitUrl: null,
  driverLicenseFrontUrl: null,
  driverLicenseBackUrl: null,
};

const emptyVehicle: VehicleData = {
  categoryCode: "",
  seatCount: "4",
  brand: "",
  model: "",
  color: "",
  plate: "",
  manufactureYear: "",
  registrationUrl: "",
  inspectionUrl: "",
  insuranceUrl: "",
  vehiclePhotoUrl: "",
  platePhotoUrl: "",
};

const initialState: DriverRegistrationState = {
  personal: null,
  address: null,
  driver: null,
  documents: { ...emptyDocuments },
  vehicle: { ...emptyVehicle },
  draftApplicationId: undefined,
  status: "draft",
  uploading: { ...emptyUploading },
  uploadError: { ...emptyUploadError },
  application: {
    id: "",
    state: "draft",
  },
};

const driverRegistrationSlice = createSlice({
  name: "driverRegistration",
  initialState,
  reducers: {
    updatePersonal: (state, action: PayloadAction<PersonalData>) => {
      state.personal = action.payload;
    },
    updateAddress: (state, action: PayloadAction<AddressData>) => {
      state.address = action.payload;
    },
    updateDriver: (state, action: PayloadAction<DriverData>) => {
      state.driver = action.payload;
    },
    updateDocuments: (state, action: PayloadAction<Partial<DocumentsData>>) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    updateVehicle: (state, action: PayloadAction<Partial<VehicleData>>) => {
      state.vehicle = { ...state.vehicle, ...action.payload };
    },
    setDraftApplicationId: (state, action: PayloadAction<string | undefined>) => {
      state.draftApplicationId = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"draft" | "submitting" | "submitted" | "error">
    ) => {
      state.status = action.payload;
    },
    setUploading: (
      state,
      action: PayloadAction<{ field: DocKey; uploading: boolean }>
    ) => {
      state.uploading[action.payload.field] = action.payload.uploading;
    },
    setUploadError: (
      state,
      action: PayloadAction<{ field: DocKey; error: string | null }>
    ) => {
      state.uploadError[action.payload.field] = action.payload.error;
    },
    setApplication: (state, action: PayloadAction<Application>) => {
      state.application = action.payload;
    },
    resetForm: (state) => {
      state.personal = null;
      state.address = null;
      state.driver = null;
      state.documents = { ...emptyDocuments };
      state.vehicle = { ...emptyVehicle };
      state.draftApplicationId = undefined;
      state.status = "draft";
      state.uploading = { ...emptyUploading };
      state.uploadError = { ...emptyUploadError };
      state.application = {
        id: "",
        state: "draft",
      };
    },
  },
});

export const {
  updatePersonal,
  updateAddress,
  updateDriver,
  updateDocuments,
  updateVehicle,
  setDraftApplicationId,
  setStatus,
  setUploading,
  setUploadError,
  setApplication,
  resetForm,
} = driverRegistrationSlice.actions;

export default driverRegistrationSlice.reducer;
