export interface Driver {
    _id: string;
    userId: string;
    status: string;
    rejectionReason?: string;
    licenseNumber: string;
    licenseExpiry: string;
    yearsExperience: number;
    services: string[];
    personal: {
      fullName: string;
      phone: string;
      email: string;
      idNumber: string;
    };
    address: {
      province: string;
      district: string;
      ward: string;
      specificAddress: string;
    };
    documents: {
      idFrontUrl: string;
      idBackUrl: string;
      driverLicenseFrontUrl: string;
      driverLicenseBackUrl: string;
    };
    submittedAt: string;
    decidedAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DriverResponse {
    items: Driver[];
    total: number;
    page: number;
    limit: number;
  }