import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
}

interface DocumentsData {
  idFrontUrl: string;
  idBackUrl: string;
  driverLicenseFrontUrl: string;
  driverLicenseBackUrl: string;
}

interface UploadingState {
  idFrontUrl: boolean;
  idBackUrl: boolean;
  driverLicenseFrontUrl: boolean;
  driverLicenseBackUrl: boolean;
}

interface UploadErrorState {
  idFrontUrl: string | null;
  idBackUrl: string | null;
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
  draftApplicationId: string | undefined;
  status: "draft" | "submitting" | "submitted" | "error";
  uploading: UploadingState;
  uploadError: UploadErrorState;
  application: Application;
}

const initialState: DriverRegistrationState = {
  personal: null,
  address: null,
  driver: null,
  documents: {
    idFrontUrl: "",
    idBackUrl: "",
    driverLicenseFrontUrl: "",
    driverLicenseBackUrl: "",
  },
  draftApplicationId: undefined,
  status: "draft",
  uploading: {
    idFrontUrl: false,
    idBackUrl: false,
    driverLicenseFrontUrl: false,
    driverLicenseBackUrl: false,
  },
  uploadError: {
    idFrontUrl: null,
    idBackUrl: null,
    driverLicenseFrontUrl: null,
    driverLicenseBackUrl: null,
  },
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
    setDraftApplicationId: (state, action: PayloadAction<string | undefined>) => {
      state.draftApplicationId = action.payload;
    },
    setStatus: (state, action: PayloadAction<"draft" | "submitting" | "submitted" | "error">) => {
      state.status = action.payload;
    },
    setUploading: (
      state,
      action: PayloadAction<{ field: keyof UploadingState; uploading: boolean }>
    ) => {
      state.uploading[action.payload.field] = action.payload.uploading;
    },
    setUploadError: (
      state,
      action: PayloadAction<{ field: keyof UploadErrorState; error: string | null }>
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
      state.documents = {
        idFrontUrl: "",
        idBackUrl: "",
        driverLicenseFrontUrl: "",
        driverLicenseBackUrl: "",
      };
      state.draftApplicationId = undefined;
      state.status = "draft";
      state.uploading = {
        idFrontUrl: false,
        idBackUrl: false,
        driverLicenseFrontUrl: false,
        driverLicenseBackUrl: false,
      };
      state.uploadError = {
        idFrontUrl: null,
        idBackUrl: null,
        driverLicenseFrontUrl: null,
        driverLicenseBackUrl: null,
      };
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
  setDraftApplicationId,
  setStatus,
  setUploading,
  setUploadError,
  setApplication,
  resetForm,
} = driverRegistrationSlice.actions;

export default driverRegistrationSlice.reducer;

