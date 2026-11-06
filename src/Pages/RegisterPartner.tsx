import { useEffect, useState, useMemo } from "react";
import {
  useForm,
  Controller,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  Car,
  Upload,
  User,
  FileText,
  CheckCircle,
  MapPin,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import {
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
} from "../redux/features/driverRegistrationSlice";
import {
  personalSchema,
  addressSchema,
  driverSchema,
  type PersonalFormData,
  type AddressFormData,
  type DriverFormData,
} from "../Utils/validationSchemas";
import {
  saveDraftApplication,
  getMyDriverApplications,
  updateDriverApplication,
  submitDriverApplication,
  uploadDocuments,
  uploadVehicleDocuments,
  saveRideDriverVehicle,
  submitRideDriverRegistration,
  getRideCategories,
  type DriverApplicationData,
  type DriverCapabilityType,
} from "../Config/driverApi";
import { toast } from "react-toastify";

const steps = [
  { id: 1, title: "Dịch vụ & cá nhân", icon: User },
  { id: 2, title: "Địa chỉ", icon: MapPin },
  { id: 3, title: "Thông tin tài xế", icon: Car },
  { id: 4, title: "Tài liệu", icon: FileText },
  { id: 5, title: "Xác nhận", icon: CheckCircle },
];

// Map frontend service IDs to backend enum values
const serviceMapping: { [key: string]: string } = {
  hourly: "dich_vu_tai_xe_theo_gio",
  "long-distance": "dich_vu_tai_xe_lien_tinh",
  daily: "dich_vu_tai_xe_theo_ngay",
  per_km: "dich_vu_tai_xe_theo_cay_so",
};

const driverTypeOptions: Array<{
  id: DriverCapabilityType;
  label: string;
  description: string;
}> = [
  {
    id: "DRIVER_FOR_HIRE",
    label: "Lái hộ",
    description: "Lái xe của khách theo giờ / ngày / km / liên tỉnh.",
  },
  {
    id: "RIDE_HAILING",
    label: "Đặt xe",
    description: "Nhận chuyến đặt xe bằng xe của bạn (cần đăng ký xe).",
  },
];

const services = [
  {
    id: "hourly",
    label: "Lái xe theo giờ",
    description: "Dịch vụ lái xe trong thành phố",
  },
  {
    id: "long-distance",
    label: "Lái xe đường liên tỉnh",
    description: "Dịch vụ lái xe quãng đường dài, trên 100km.",
  },
  {
    id: "per_km",
    label: "Lái xe theo Km",
    description: "Dịch vụ lái xe quãng đường ngắn, dưới 100km.",
  },
  {
    id: "daily",
    label: "Lái xe theo ngày",
    description: "Dịch vụ lái xe trong ngày, hoặc 2 ngày, 3 ngày.",
  },
];

const REQUIRED_DOC_FIELDS = [
  "idFrontUrl",
  "idBackUrl",
  "idVneidUrl",
  "portraitUrl",
  "driverLicenseFrontUrl",
  "driverLicenseBackUrl",
] as const;

export default function RegisterPartner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  const [availableWards, setAvailableWards] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [documentFiles, setDocumentFiles] = useState<{
    idFront?: File;
    idBack?: File;
    idVneid?: File;
    portrait?: File;
    driverLicenseFront?: File;
    driverLicenseBack?: File;
  }>({});
  const [rideCategories, setRideCategories] = useState<
    Array<{ code: string; name?: string; seatCount?: number }>
  >([]);

  const registrationState = useSelector(
    (state: RootState) => state.driverRegistration,
  );

  const personalData = registrationState?.personal || {
    fullName: "",
    phone: "",
    email: "",
    idNumber: "",
    gender: "Nam" as const,
  };

  const addressData = registrationState?.address || {
    province: "",
    district: "",
    ward: "",
    streetAddress: "",
  };

  const driverData = registrationState?.driver || {
    licenseNumber: "",
    licenseExpiryDate: "",
    yearsExperience: "",
    services: [],
    driverTypes: [] as DriverCapabilityType[],
  };

  const documentsData = registrationState?.documents || {
    idFrontUrl: "",
    idBackUrl: "",
    idVneidUrl: "",
    portraitUrl: "",
    driverLicenseFrontUrl: "",
    driverLicenseBackUrl: "",
  };

  const vehicleData = registrationState?.vehicle || {
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

  const draftApplicationId = registrationState?.draftApplicationId;
  const uploadingState = registrationState?.uploading || {
    idFrontUrl: false,
    idBackUrl: false,
    idVneidUrl: false,
    portraitUrl: false,
    driverLicenseFrontUrl: false,
    driverLicenseBackUrl: false,
  };
  const uploadErrorState = registrationState?.uploadError || {
    idFrontUrl: null,
    idBackUrl: null,
    idVneidUrl: null,
    portraitUrl: null,
    driverLicenseFrontUrl: null,
    driverLicenseBackUrl: null,
  };
  const wantsHire = (driverData.driverTypes || []).includes("DRIVER_FOR_HIRE");
  const wantsRide = (driverData.driverTypes || []).includes("RIDE_HAILING");

  // Form hooks for each step
  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: personalData,
    mode: "onChange",
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: addressData.province || "",
      district: addressData.district || "",
      ward: addressData.ward || "",
      streetAddress: addressData.streetAddress || "",
    },
    mode: "onChange",
  });

  const driverForm = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema) as Resolver<DriverFormData>,
    defaultValues: {
      driverTypes: (driverData.driverTypes || []) as DriverCapabilityType[],
      licenseNumber: driverData.licenseNumber || "",
      licenseExpiryDate: driverData.licenseExpiryDate || "",
      yearsExperience: driverData.yearsExperience || "",
      services: driverData.services || [],
    },
    mode: "onChange",
  });
  const watchedDriverTypes = driverForm.watch("driverTypes") || [];
  const formWantsHire = watchedDriverTypes.includes("DRIVER_FOR_HIRE");
  const formWantsRide = watchedDriverTypes.includes("RIDE_HAILING");

  // Load provinces on mount
  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          const formatted = data.data.map((p: any) => ({
            idProvince: p.id,
            name: p.name,
          }));
          setProvinces(formatted);
        }
      })
      .catch((err) => console.error("Lỗi tải tỉnh/thành:", err));
  }, []);

  useEffect(() => {
    getRideCategories()
      .then((res) => {
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        setRideCategories(
          list
            .map((item: any) => ({
              code: String(item.code || item.categoryCode || ""),
              name: String(item.name || item.label || item.code || ""),
              seatCount: Number(item.seatCount || item.seats || 4) || 4,
            }))
            .filter((item: { code: string }) => item.code),
        );
      })
      .catch(() => setRideCategories([]));
  }, []);

  // Load draft on mount (after provinces are loaded)
  useEffect(() => {
    if (provinces.length === 0) return; // Wait for provinces to load

    const loadDraft = async () => {
      try {
        const response = await getMyDriverApplications();
        if (response.success && response.data && response.data.length > 0) {
          const draftApplication = response.data.find(
            (app: any) => app.status === "draft",
          );

          if (draftApplication) {
            dispatch(setDraftApplicationId(draftApplication._id));

            // Load personal data
            if (draftApplication.personal) {
              const personal = {
                fullName: draftApplication.personal.fullName || "",
                phone: draftApplication.personal.phone || "",
                email: draftApplication.personal.email || "",
                idNumber: draftApplication.personal.idNumber || "",
                gender: (draftApplication.personal.gender === "Nữ"
                  ? "Nữ"
                  : "Nam") as "Nam" | "Nữ",
              };
              dispatch(updatePersonal(personal));
              personalForm.reset(personal);
            }

            // Load address data - need to match names to IDs
            if (draftApplication.address) {
              // Find province ID by name
              const provinceId =
                provinces.find(
                  (p) => p.name === draftApplication.address.province,
                )?.idProvince || "";

              // If we have a province ID, load districts
              if (provinceId) {
                fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.error === 0) {
                      setAvailableDistricts(data.data);
                      const districtId =
                        data.data.find(
                          (d: any) =>
                            d.name === draftApplication.address.district,
                        )?.id || "";

                      // If we have a district ID, load wards
                      if (districtId) {
                        fetch(
                          `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`,
                        )
                          .then((res) => res.json())
                          .then((wardData) => {
                            if (wardData.error === 0) {
                              setAvailableWards(wardData.data);
                              const wardId =
                                wardData.data.find(
                                  (w: any) =>
                                    w.name === draftApplication.address.ward,
                                )?.id || "";

                              const address = {
                                province: provinceId,
                                district: districtId,
                                ward: wardId,
                                streetAddress:
                                  draftApplication.address.specificAddress ||
                                  "",
                              };
                              dispatch(updateAddress(address));
                              addressForm.reset({
                                province: provinceId,
                                district: districtId,
                                ward: wardId,
                                streetAddress: address.streetAddress,
                              });
                              if (wardData.error === 0) {
                                const formatted = wardData.data.map(
                                  (w: any) => ({
                                    idWard: w.id,
                                    name: w.name,
                                  }),
                                );
                                setWards(formatted);
                              }
                            }
                          })
                          .catch((err) =>
                            console.error("Lỗi tải phường/xã:", err),
                          );
                      } else {
                        const address = {
                          province: provinceId,
                          district: "",
                          ward: "",
                          streetAddress:
                            draftApplication.address.specificAddress || "",
                        };
                        dispatch(updateAddress(address));
                        addressForm.reset({
                          province: provinceId,
                          district: "",
                          ward: "",
                          streetAddress: address.streetAddress,
                        });
                        if (data.error === 0) {
                          const formatted = data.data.map((d: any) => ({
                            idDistrict: d.id,
                            name: d.name,
                          }));
                          setDistricts(formatted);
                        }
                      }
                    }
                  })
                  .catch((err) => console.error("Lỗi tải quận/huyện:", err));
              } else {
                // If province not found, just set street address
                const address = {
                  province: "",
                  district: "",
                  ward: "",
                  streetAddress: draftApplication.address.specificAddress || "",
                };
                dispatch(updateAddress(address));
                addressForm.reset({
                  province: "",
                  district: "",
                  ward: "",
                  streetAddress: address.streetAddress,
                });
              }
            }

            // Load driver data
            if (draftApplication.licenseNumber) {
              let expiryDate = draftApplication.licenseExpiry || "";
              if (expiryDate.includes("-")) {
                const [year, month, day] = expiryDate.split("-");
                expiryDate = `${day}/${month}/${year}`;
              }

              // Map backend services to frontend IDs
              const frontendServices = (draftApplication.services || []).map(
                (service: string) => {
                  return (
                    Object.keys(serviceMapping).find(
                      (key) => serviceMapping[key] === service,
                    ) || service
                  );
                },
              );

              const driver = {
                licenseNumber: draftApplication.licenseNumber || "",
                licenseExpiryDate: expiryDate,
                yearsExperience:
                  draftApplication.yearsExperience?.toString() || "",
                services: frontendServices as any,
                driverTypes: (driverData.driverTypes?.length
                  ? driverData.driverTypes
                  : frontendServices.length > 0
                    ? (["DRIVER_FOR_HIRE"] as DriverCapabilityType[])
                    : []) as DriverCapabilityType[],
              };
              dispatch(updateDriver(driver));
              driverForm.reset({
                driverTypes: driver.driverTypes,
                licenseNumber: driver.licenseNumber,
                licenseExpiryDate: driver.licenseExpiryDate,
                yearsExperience: driver.yearsExperience,
                services: driver.services,
              });
            }

            // Load documents
            if (draftApplication.documents) {
              dispatch(
                updateDocuments({
                  idFrontUrl: draftApplication.documents.idFrontUrl || "",
                  idBackUrl: draftApplication.documents.idBackUrl || "",
                  idVneidUrl:
                    draftApplication.documents.idVneidUrl ||
                    draftApplication.documents.vneidUrl ||
                    "",
                  portraitUrl: draftApplication.documents.portraitUrl || "",
                  driverLicenseFrontUrl:
                    draftApplication.documents.driverLicenseFrontUrl || "",
                  driverLicenseBackUrl:
                    draftApplication.documents.driverLicenseBackUrl || "",
                }),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    loadDraft();
  }, [provinces]);

  const handleProvinceChange = (provinceId: string) => {
    addressForm.setValue("province", provinceId);
    addressForm.setValue("district", "");
    addressForm.setValue("ward", "");
    dispatch(
      updateAddress({
        province: provinceId,
        district: "",
        ward: "",
        streetAddress: addressData.streetAddress || "",
      }),
    );
    setAvailableDistricts([]);
    setAvailableWards([]);

    if (!provinceId) return;

    fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          setAvailableDistricts(data.data);
          const formatted = data.data.map((d: any) => ({
            idDistrict: d.id,
            name: d.name,
          }));
          setDistricts(formatted);
        } else {
          console.error("Không thể tải quận/huyện:", data.error_text);
        }
      })
      .catch((err) => console.error("Lỗi tải quận/huyện:", err));
  };

  const handleDistrictChange = (districtId: string) => {
    addressForm.setValue("district", districtId);
    addressForm.setValue("ward", "");
    dispatch(
      updateAddress({
        province: addressData.province || "",
        district: districtId,
        ward: "",
        streetAddress: addressData.streetAddress || "",
      }),
    );
    setAvailableWards([]);

    if (!districtId) return;

    fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          setAvailableWards(data.data);
          const formatted = data.data.map((w: any) => ({
            idWard: w.id,
            name: w.name,
          }));
          setWards(formatted);
        } else {
          console.error("Không thể tải phường/xã:", data.error_text);
        }
      })
      .catch((err) => console.error("Lỗi tải phường/xã:", err));
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const draftData: Partial<DriverApplicationData> = {};

      // Include personal if exists
      if (personalData.fullName || personalData.phone || personalData.email) {
        draftData.personal = {
          fullName: personalData.fullName || "",
          phone: personalData.phone || "",
          email: personalData.email || "",
          idNumber: personalData.idNumber || "",
          gender: personalData.gender,
        };
      }

      // Include address if all required fields exist
      if (
        addressData.province &&
        addressData.district &&
        addressData.ward &&
        addressData.streetAddress
      ) {
        const provinceName =
          provinces.find((p) => p.idProvince === addressData.province)?.name ||
          addressData.province;
        const districtName =
          availableDistricts.find((d) => d.id === addressData.district)?.name ||
          addressData.district;
        const wardName =
          availableWards.find((w) => w.id === addressData.ward)?.name ||
          addressData.ward;

        draftData.address = {
          province: provinceName,
          district: districtName,
          ward: wardName,
          specificAddress: addressData.streetAddress,
        };
      }

      // Include driver fields if ALL fields exist
      if (
        driverData.licenseNumber &&
        driverData.licenseExpiryDate &&
        driverData.yearsExperience &&
        (driverData.driverTypes?.length || 0) > 0
      ) {
        const [day, month, year] = driverData.licenseExpiryDate.split("/");
        const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0",
        )}`;

        draftData.licenseNumber = driverData.licenseNumber;
        draftData.licenseExpiry = formattedDate;
        draftData.yearsExperience = parseInt(driverData.yearsExperience) || 0;

        // Map frontend service IDs to backend enum values
        if (wantsHire && driverData.services.length > 0) {
          draftData.services = driverData.services.map((id) => {
            const mapped = serviceMapping[id];
            if (
              mapped === "dich_vu_tai_xe_theo_gio" ||
              mapped === "dich_vu_tai_xe_lien_tinh" ||
              mapped === "dich_vu_tai_xe_theo_ngay" ||
              mapped === "dich_vu_tai_xe_theo_cay_so"
            ) {
              return mapped;
            }
            return "dich_vu_tai_xe_theo_gio"; // fallback
          });
        }
      }

      // Include documents if at least one exists
      const hasDocuments = Object.values(documentsData).some(
        (url) => url && url.trim() !== "",
      );
      if (hasDocuments) {
        draftData.documents = {
          idFrontUrl: documentsData.idFrontUrl || "",
          idBackUrl: documentsData.idBackUrl || "",
          idVneidUrl: documentsData.idVneidUrl || "",
          portraitUrl: documentsData.portraitUrl || "",
          driverLicenseFrontUrl: documentsData.driverLicenseFrontUrl || "",
          driverLicenseBackUrl: documentsData.driverLicenseBackUrl || "",
        };
      }

      let response;
      let finalApplicationId = draftApplicationId;

      if (draftApplicationId) {
        try {
          response = await updateDriverApplication(
            draftApplicationId,
            draftData,
          );
        } catch (updateError: any) {
          console.warn(
            "Failed to update draft, creating new one:",
            updateError.message,
          );
          dispatch(setDraftApplicationId(undefined));
          response = await saveDraftApplication(draftData);
          if (response.success && response.data) {
            finalApplicationId = response.data._id;
            dispatch(setDraftApplicationId(finalApplicationId));
          }
        }
      } else {
        response = await saveDraftApplication(draftData);
        if (response.success && response.data) {
          finalApplicationId = response.data._id;
          dispatch(setDraftApplicationId(finalApplicationId));
        }
      }

      if (response && response.success) {
        dispatch(
          setApplication({
            id: finalApplicationId || "",
            state: "draft",
          }),
        );
        dispatch(setStatus("draft"));
        alert("Đã lưu bản nháp thành công!");
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      alert(error.message || "Không thể lưu bản nháp. Vui lòng thử lại.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleFileUpload = async (
    field: keyof typeof documentsData,
    file: File,
  ) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB");
      return;
    }

    // Upload to backend
    const uploadFieldMap: {
      [key in keyof typeof documentsData]: keyof typeof documentFiles;
    } = {
      idFrontUrl: "idFront",
      idBackUrl: "idBack",
      idVneidUrl: "idVneid",
      portraitUrl: "portrait",
      driverLicenseFrontUrl: "driverLicenseFront",
      driverLicenseBackUrl: "driverLicenseBack",
    };

    const uploadField = uploadFieldMap[field];
    if (!uploadField) return;

    setDocumentFiles((prev) => ({ ...prev, [uploadField]: file }));

    dispatch(setUploading({ field, uploading: true }));
    dispatch(setUploadError({ field, error: null }));

    try {
      const response = await uploadDocuments({ [uploadField]: file });
      if (response.success && response.data) {
        dispatch(
          updateDocuments({
            [field]: response.data[field] || "",
          }),
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      dispatch(
        setUploadError({
          field,
          error: error.message || "Lỗi tải lên",
        }),
      );
      toast.error("Lỗi tải lên. Vui lòng thử lại.");
    } finally {
      dispatch(setUploading({ field, uploading: false }));
    }
  };

  const removeFile = (field: keyof typeof documentsData) => {
    dispatch(
      updateDocuments({
        [field]: "",
      }),
    );
    const uploadFieldMap: { [key: string]: keyof typeof documentFiles } = {
      idFrontUrl: "idFront",
      idBackUrl: "idBack",
      idVneidUrl: "idVneid",
      portraitUrl: "portrait",
      driverLicenseFrontUrl: "driverLicenseFront",
      driverLicenseBackUrl: "driverLicenseBack",
    };
    const uploadField = uploadFieldMap[field];
    if (uploadField) {
      setDocumentFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[uploadField];
        return newFiles;
      });
    }
  };

  const onPersonalSubmit = (data: PersonalFormData) => {
    const types = (driverForm.getValues("driverTypes") ||
      []) as DriverCapabilityType[];
    if (types.length === 0) {
      toast.warning(
        "Vui lòng chọn ít nhất một loại dịch vụ tài xế: Lái hộ và/hoặc Đặt xe",
      );
      return;
    }
    dispatch(updatePersonal(data));
    dispatch(
      updateDriver({
        licenseNumber: driverData.licenseNumber || "",
        licenseExpiryDate: driverData.licenseExpiryDate || "",
        yearsExperience: driverData.yearsExperience || "",
        services: driverData.services || [],
        driverTypes: types,
      }),
    );
    setCurrentStep(2);
  };

  const onPersonalError = (errors: FieldErrors<PersonalFormData>) => {
    const missingFields = Object.keys(errors).map((field) => {
      const fieldNames: { [key: string]: string } = {
        fullName: "Họ và tên",
        phone: "Số điện thoại",
        email: "Email",
        idNumber: "CMND/CCCD",
        gender: "Giới tính",
      };
      return fieldNames[field] || field;
    });
    toast.warning(
      `Vui lòng điền đầy đủ thông tin bắt buộc:\n- ${missingFields.join(
        "\n- ",
      )}`,
    );
  };

  const onAddressSubmit = (data: AddressFormData) => {
    // Store IDs in Redux, we'll convert to names when submitting
    dispatch(
      updateAddress({
        province: data.province,
        district: data.district,
        ward: data.ward,
        streetAddress: data.streetAddress,
      }),
    );
    setCurrentStep(3);
  };

  const onAddressError = (errors: FieldErrors<AddressFormData>) => {
    const missingFields = Object.keys(errors).map((field) => {
      const fieldNames: { [key: string]: string } = {
        province: "Tỉnh/thành phố",
        district: "Quận/huyện",
        ward: "Phường/xã",
        streetAddress: "Địa chỉ cụ thể",
      };
      return fieldNames[field] || field;
    });
    toast.warning(
      `Vui lòng điền đầy đủ thông tin địa chỉ:\n- ${missingFields.join("\n- ")}`,
    );
  };

  const onDriverSubmit = (data: DriverFormData) => {
    if (data.driverTypes.includes("RIDE_HAILING")) {
      if (
        !vehicleData.categoryCode ||
        !vehicleData.brand.trim() ||
        !vehicleData.color.trim() ||
        !vehicleData.plate.trim()
      ) {
        toast.warning(
          "Đăng ký Đặt xe cần đủ thông tin xe: loại xe, hãng, màu, biển số",
        );
        return;
      }
    }
    dispatch(
      updateDriver({
        ...data,
        driverTypes: data.driverTypes as DriverCapabilityType[],
      }),
    );
    setCurrentStep(4);
  };

  const onDriverError = (errors: FieldErrors<DriverFormData>) => {
    const missingFields = Object.keys(errors).map((field) => {
      const fieldNames: { [key: string]: string } = {
        driverTypes: "Loại dịch vụ tài xế",
        licenseNumber: "Số bằng lái xe",
        licenseExpiryDate: "Ngày hết hạn bằng lái",
        yearsExperience: "Số năm kinh nghiệm",
        services: "Gói dịch vụ lái hộ",
      };
      return fieldNames[field] || field;
    });
    toast.warning(
      `Vui lòng điền đầy đủ thông tin tài xế:\n- ${missingFields.join("\n- ")}`,
    );
  };

  const nextStep = () => {
    if (currentStep === 1) {
      personalForm.handleSubmit(onPersonalSubmit, onPersonalError)();
    } else if (currentStep === 2) {
      addressForm.handleSubmit(onAddressSubmit, onAddressError)();
    } else if (currentStep === 3) {
      driverForm.handleSubmit(onDriverSubmit, onDriverError)();
    } else if (currentStep === 4) {
      const docLabels: Record<(typeof REQUIRED_DOC_FIELDS)[number], string> = {
        idFrontUrl: "CMND/CCCD mặt trước",
        idBackUrl: "CMND/CCCD mặt sau",
        idVneidUrl: "CCCD điện tử VNeID",
        portraitUrl: "Ảnh chân dung",
        driverLicenseFrontUrl: "Bằng lái xe mặt trước",
        driverLicenseBackUrl: "Bằng lái xe mặt sau",
      };
      const missingDocs = REQUIRED_DOC_FIELDS.filter(
        (field) => !documentsData[field]?.startsWith("https://"),
      ).map((field) => docLabels[field]);

      if (missingDocs.length > 0) {
        toast.warning(
          `Vui lòng tải lên đầy đủ các tài liệu bắt buộc:\n- ${missingDocs.join(
            "\n- ",
          )}`,
        );
        return;
      }

      if (wantsRide) {
        const missingVehicleDocs = [
          !vehicleData.registrationUrl?.startsWith("https://")
            ? "Cà vẹt / đăng ký xe"
            : "",
          !vehicleData.vehiclePhotoUrl?.startsWith("https://") ? "Ảnh xe" : "",
          !vehicleData.platePhotoUrl?.startsWith("https://")
            ? "Ảnh biển số"
            : "",
        ].filter(Boolean);
        if (missingVehicleDocs.length > 0) {
          toast.warning(
            `Đăng ký Đặt xe cần thêm giấy tờ xe:\n- ${missingVehicleDocs.join(
              "\n- ",
            )}`,
          );
          return;
        }
      }

      const isAnyUploading = Object.values(uploadingState).some((u) => u);
      if (isAnyUploading) {
        toast.warning(
          "Vui lòng đợi quá trình tải lên hoàn tất trước khi tiếp tục",
        );
        return;
      }

      const hasUploadErrors = Object.values(uploadErrorState).some(
        (e) => e !== null,
      );
      if (hasUploadErrors) {
        toast.warning("Vui lòng sửa lỗi tải lên tài liệu trước khi tiếp tục");
        return;
      }

      setCurrentStep(5);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (
      !personalData.fullName ||
      !addressData.streetAddress ||
      !driverData.licenseNumber
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const isAnyUploading = Object.values(uploadingState).some((u) => u);
    if (isAnyUploading) {
      toast.warning("Vui lòng đợi quá trình tải lên hoàn tất");
      return;
    }

    const allDocsUploaded = REQUIRED_DOC_FIELDS.every((field) =>
      documentsData[field]?.startsWith("https://"),
    );

    if (!allDocsUploaded) {
      toast.error(
        "Vui lòng tải lên đủ giấy tờ: CCCD trước/sau, VNeID, ảnh chân dung, GPLX trước/sau",
      );
      return;
    }

    if ((driverData.driverTypes || []).length === 0) {
      toast.error("Vui lòng chọn loại dịch vụ tài xế muốn đăng ký");
      return;
    }

    setIsSubmitting(true);
    dispatch(setStatus("submitting"));

    try {
      const provinceName =
        provinces.find((p) => p.idProvince === addressData.province)?.name ||
        addressData.province;
      const districtName =
        availableDistricts.find((d) => d.id === addressData.district)?.name ||
        addressData.district;
      const wardName =
        availableWards.find((w) => w.id === addressData.ward)?.name ||
        addressData.ward;

      const [day, month, year] = driverData.licenseExpiryDate.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0",
      )}`;

      const mappedServices = wantsHire
        ? driverData.services.map((id) => {
            const mapped = serviceMapping[id];
            if (
              mapped === "dich_vu_tai_xe_theo_gio" ||
              mapped === "dich_vu_tai_xe_lien_tinh" ||
              mapped === "dich_vu_tai_xe_theo_ngay" ||
              mapped === "dich_vu_tai_xe_theo_cay_so"
            ) {
              return mapped;
            }
            return "dich_vu_tai_xe_theo_gio";
          })
        : [];

      const applicationData: DriverApplicationData = {
        personal: {
          fullName: personalData.fullName,
          phone: personalData.phone,
          email: personalData.email,
          idNumber: personalData.idNumber,
          gender: personalData.gender,
        },
        address: {
          province: provinceName,
          district: districtName,
          ward: wardName,
          specificAddress: addressData.streetAddress,
        },
        documents: {
          idFrontUrl: documentsData.idFrontUrl,
          idBackUrl: documentsData.idBackUrl,
          idVneidUrl: documentsData.idVneidUrl,
          portraitUrl: documentsData.portraitUrl,
          driverLicenseFrontUrl: documentsData.driverLicenseFrontUrl,
          driverLicenseBackUrl: documentsData.driverLicenseBackUrl,
        },
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: formattedDate,
        yearsExperience: parseInt(driverData.yearsExperience) || 0,
        ...(mappedServices.length > 0 ? { services: mappedServices } : {}),
      };

      let applicationId = draftApplicationId;

      if (draftApplicationId) {
        try {
          await updateDriverApplication(draftApplicationId, applicationData);
          await submitDriverApplication(draftApplicationId);
          applicationId = draftApplicationId;
        } catch (updateError: any) {
          const createResponse = await saveDraftApplication(applicationData);
          await submitDriverApplication(createResponse.data._id);
          applicationId = createResponse.data._id;
        }
      } else {
        const createResponse = await saveDraftApplication(applicationData);
        await submitDriverApplication(createResponse.data._id);
        applicationId = createResponse.data._id;
      }

      if (wantsRide) {
        const seatCount =
          Number(vehicleData.seatCount) ||
          rideCategories.find((c) => c.code === vehicleData.categoryCode)
            ?.seatCount ||
          4;
        await saveRideDriverVehicle({
          categoryCode: vehicleData.categoryCode,
          seatCount,
          brand: vehicleData.brand,
          make: vehicleData.brand,
          model: vehicleData.model || undefined,
          color: vehicleData.color,
          vehicleColor: vehicleData.color,
          plate: vehicleData.plate,
          licensePlate: vehicleData.plate,
          manufactureYear: vehicleData.manufactureYear
            ? Number(vehicleData.manufactureYear)
            : undefined,
          documents: {
            registrationUrl: vehicleData.registrationUrl,
            inspectionUrl: vehicleData.inspectionUrl || undefined,
            insuranceUrl: vehicleData.insuranceUrl || undefined,
            vehiclePhotoUrl: vehicleData.vehiclePhotoUrl,
            platePhotoUrl: vehicleData.platePhotoUrl,
          } as Record<string, string>,
        });
        await submitRideDriverRegistration();
      }

      dispatch(
        setApplication({
          id: applicationId || "",
          state: "pending",
        }),
      );
      dispatch(setStatus("submitted"));

      toast.success(
        wantsRide && wantsHire
          ? "Đã gửi hồ sơ Lái hộ và Đặt xe để kiểm duyệt."
          : wantsRide
            ? "Đã gửi đăng ký Đặt xe để kiểm duyệt."
            : "Đăng ký thành công! Hồ sơ của bạn đang trong quá trình kiểm duyệt.",
      );

      navigate("/register-partner/status");
    } catch (error: any) {
      console.error("Submission error:", error);
      dispatch(setStatus("error"));
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại.";
      alert(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  const FileUploadCard = ({
    title,
    description,
    field,
    uploadedUrl,
    uploading,
    uploadError,
  }: {
    title: string;
    description: string;
    field: keyof typeof documentsData;
    uploadedUrl: string;
    uploading: boolean;
    uploadError: string | null;
  }) => {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        <div className="text-center">
          {uploadedUrl && uploadedUrl.startsWith("https://") ? (
            <div className="space-y-3">
              <div className="relative inline-block">
                <img
                  src={uploadedUrl}
                  alt={title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover border"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-800 text-white h-6 w-6 p-0 rounded-full flex items-center justify-center"
                  onClick={() => removeFile(field)}
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="text-sm">
                <p className="font-medium text-green-600">✓ Đã tải lên</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div className="text-center">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              <div className="flex flex-col items-center">
                <input
                  id={`file-input-${field}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(field, file);
                    }
                  }}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor={`file-input-${field}`}
                  className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer text-sm mt-2 ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải lên...
                    </span>
                  ) : (
                    "Chọn file"
                  )}
                </label>
                {uploadError && (
                  <p className="text-red-500 text-xs mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const isValidUploadedUrl = (url: string): boolean => {
    return !!url && (url.startsWith("https://") || url.startsWith("http://"));
  };

  const isContinueDisabled = useMemo(() => {
    if (currentStep === 4) {
      const isAnyUploading = Object.values(uploadingState).some((u) => u);
      const hasUploadErrors = Object.values(uploadErrorState).some(
        (e) => e !== null,
      );
      const hasLocalURIs = Object.values(documentsData).some(
        (url) => url && !isValidUploadedUrl(url),
      );
      return isAnyUploading || hasUploadErrors || hasLocalURIs;
    }
    return false;
  }, [currentStep, uploadingState, uploadErrorState, documentsData]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-50 mt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký trở thành tài xế
            </h1>
            <p className="text-gray-600">
              Tham gia cộng đồng tài xế chuyên nghiệp của chúng tôi
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isSavingDraft ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Lưu nháp</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`rounded-full p-2 ${
                      step.id <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="ml-2 font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {currentStep === 1 &&
                "Chọn loại tài xế muốn đăng ký, rồi điền thông tin cá nhân"}
              {currentStep === 2 && "Nhập địa chỉ chi tiết"}
              {currentStep === 3 &&
                "Thông tin bằng lái, kinh nghiệm và gói dịch vụ"}
              {currentStep === 4 && "Tải lên các tài liệu cần thiết"}
              {currentStep === 5 && "Xem lại thông tin và hoàn tất đăng ký"}
            </p>
          </div>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="font-medium">
                  Bạn muốn trở thành tài xế loại nào? *
                </label>
                <p className="text-xs text-gray-500">
                  Có thể chọn một hoặc cả hai.
                </p>
                <Controller
                  name="driverTypes"
                  control={driverForm.control}
                  render={({ field }) => (
                    <div className="grid md:grid-cols-2 gap-3">
                      {driverTypeOptions.map((option) => {
                        const checked = (
                          (field.value || []) as DriverCapabilityType[]
                        ).includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              const current = (field.value ||
                                []) as DriverCapabilityType[];
                              const next = checked
                                ? current.filter((id) => id !== option.id)
                                : [...current, option.id];
                              field.onChange(next);
                              dispatch(
                                updateDriver({
                                  licenseNumber: driverData.licenseNumber || "",
                                  licenseExpiryDate:
                                    driverData.licenseExpiryDate || "",
                                  yearsExperience:
                                    driverData.yearsExperience || "",
                                  services: driverData.services || [],
                                  driverTypes: next,
                                }),
                              );
                            }}
                            className={`text-left border-2 rounded-xl p-4 transition-colors ${
                              checked
                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-gray-900">
                                {option.label}
                              </div>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  checked
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {checked ? "Đã chọn" : "Chọn"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {(driverForm.watch("driverTypes") || []).length === 0 && (
                  <p className="text-amber-600 text-xs">
                    Bắt buộc chọn Lái hộ và/hoặc Đặt xe trước khi tiếp tục.
                  </p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <Controller
                    name="fullName"
                    control={personalForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            personalForm.formState.errors.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="fullName"
                          {...field}
                          placeholder="Nguyễn Văn A"
                        />
                        {personalForm.formState.errors.fullName && (
                          <p className="text-red-500 text-xs">
                            {personalForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <Controller
                    name="phone"
                    control={personalForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            personalForm.formState.errors.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="phone"
                          {...field}
                          placeholder="0901234567"
                        />
                        {personalForm.formState.errors.phone && (
                          <p className="text-red-500 text-xs">
                            {personalForm.formState.errors.phone.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="email">Email *</label>
                  <Controller
                    name="email"
                    control={personalForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            personalForm.formState.errors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="email"
                          type="email"
                          {...field}
                          placeholder="example@email.com"
                        />
                        {personalForm.formState.errors.email && (
                          <p className="text-red-500 text-xs">
                            {personalForm.formState.errors.email.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="idNumber">Số CCCD/CMND *</label>
                  <Controller
                    name="idNumber"
                    control={personalForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            personalForm.formState.errors.idNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="idNumber"
                          {...field}
                          placeholder="001234567890"
                        />
                        {personalForm.formState.errors.idNumber && (
                          <p className="text-red-500 text-xs">
                            {personalForm.formState.errors.idNumber.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-1 flex flex-col">
                <label htmlFor="gender">Giới tính *</label>
                <Controller
                  name="gender"
                  control={personalForm.control}
                  render={({ field }) => (
                    <>
                      <select
                        className={`border rounded-md p-2 ${
                          personalForm.formState.errors.gender
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        id="gender"
                        {...field}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                      {personalForm.formState.errors.gender && (
                        <p className="text-red-500 text-xs">
                          {personalForm.formState.errors.gender.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label>Tỉnh/Thành phố *</label>
                  <Controller
                    name="province"
                    control={addressForm.control}
                    render={({ field }) => (
                      <>
                        <select
                          className={`border rounded-md p-2 ${
                            addressForm.formState.errors.province
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleProvinceChange(e.target.value);
                          }}
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map((province) => (
                            <option
                              key={province.idProvince}
                              value={province.idProvince}
                            >
                              {province.name}
                            </option>
                          ))}
                        </select>
                        {addressForm.formState.errors.province && (
                          <p className="text-red-500 text-xs">
                            {addressForm.formState.errors.province.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label>Quận/Huyện *</label>
                  <Controller
                    name="district"
                    control={addressForm.control}
                    render={({ field }) => (
                      <>
                        <select
                          className={`border rounded-md p-2 ${
                            addressForm.formState.errors.district
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...field}
                          disabled={!addressForm.watch("province")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDistrictChange(e.target.value);
                          }}
                        >
                          <option value="">Chọn quận/huyện</option>
                          {availableDistricts.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {addressForm.formState.errors.district && (
                          <p className="text-red-500 text-xs">
                            {addressForm.formState.errors.district.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label>Phường/Xã *</label>
                  <Controller
                    name="ward"
                    control={addressForm.control}
                    render={({ field }) => (
                      <>
                        <select
                          className={`border rounded-md p-2 ${
                            addressForm.formState.errors.ward
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...field}
                          disabled={!addressForm.watch("district")}
                          onChange={(e) => {
                            field.onChange(e);
                            dispatch(
                              updateAddress({
                                province: addressData.province || "",
                                district: addressData.district || "",
                                ward: e.target.value,
                                streetAddress: addressData.streetAddress || "",
                              }),
                            );
                          }}
                        >
                          <option value="">Chọn phường/xã</option>
                          {availableWards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                        {addressForm.formState.errors.ward && (
                          <p className="text-red-500 text-xs">
                            {addressForm.formState.errors.ward.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-1 flex flex-col">
                <label htmlFor="streetAddress">Địa chỉ cụ thể *</label>
                <Controller
                  name="streetAddress"
                  control={addressForm.control}
                  render={({ field }) => (
                    <>
                      <input
                        className={`border rounded-md p-2 ${
                          addressForm.formState.errors.streetAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        id="streetAddress"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          dispatch(
                            updateAddress({
                              province: addressData.province || "",
                              district: addressData.district || "",
                              ward: addressData.ward || "",
                              streetAddress: e.target.value,
                            }),
                          );
                        }}
                        placeholder="Số nhà, tên đường..."
                      />
                      {addressForm.formState.errors.streetAddress && (
                        <p className="text-red-500 text-xs">
                          {addressForm.formState.errors.streetAddress.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 3: Driver Info */}
          {currentStep === 3 && (
            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <label>Loại dịch vụ tài xế muốn đăng ký *</label>
                <Controller
                  name="driverTypes"
                  control={driverForm.control}
                  render={({ field }) => (
                    <>
                      <div className="grid md:grid-cols-2 gap-3">
                        {driverTypeOptions.map((option) => {
                          const checked = (
                            (field.value || []) as DriverCapabilityType[]
                          ).includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                const current = (field.value ||
                                  []) as DriverCapabilityType[];
                                field.onChange(
                                  checked
                                    ? current.filter((id) => id !== option.id)
                                    : [...current, option.id],
                                );
                              }}
                              className={`text-left border rounded-lg p-4 transition-colors ${
                                checked
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="font-semibold">
                                {option.label}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {option.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {driverForm.formState.errors.driverTypes && (
                        <p className="text-red-500 text-xs mt-2">
                          {driverForm.formState.errors.driverTypes.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="licenseNumber">Số bằng lái xe *</label>
                  <Controller
                    name="licenseNumber"
                    control={driverForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            driverForm.formState.errors.licenseNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="licenseNumber"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          placeholder="0101457201280"
                        />
                        {driverForm.formState.errors.licenseNumber && (
                          <p className="text-red-500 text-xs">
                            {driverForm.formState.errors.licenseNumber.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="licenseExpiryDate">
                    Ngày hết hạn bằng lái (DD/MM/YYYY) *
                  </label>
                  <Controller
                    name="licenseExpiryDate"
                    control={driverForm.control}
                    render={({ field }) => {
                      const [day = "", month = "", year = ""] = (
                        field.value || ""
                      ).split("/");
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            className={`border rounded-md p-2 ${
                              driverForm.formState.errors.licenseExpiryDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="DD"
                            maxLength={2}
                            value={day}
                            onChange={(e) => {
                              const d = e.target.value.replace(/[^0-9]/g, "");
                              if (d.length <= 2 && (!d || parseInt(d) <= 31)) {
                                field.onChange(`${d}/${month}/${year}`);
                              }
                            }}
                          />
                          <input
                            className={`border rounded-md p-2 ${
                              driverForm.formState.errors.licenseExpiryDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="MM"
                            maxLength={2}
                            value={month}
                            onChange={(e) => {
                              const m = e.target.value.replace(/[^0-9]/g, "");
                              if (m.length <= 2 && (!m || parseInt(m) <= 12)) {
                                field.onChange(`${day}/${m}/${year}`);
                              }
                            }}
                          />
                          <input
                            className={`border rounded-md p-2 ${
                              driverForm.formState.errors.licenseExpiryDate
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="YYYY"
                            maxLength={4}
                            value={year}
                            onChange={(e) => {
                              const y = e.target.value.replace(/[^0-9]/g, "");
                              if (y.length <= 4) {
                                field.onChange(`${day}/${month}/${y}`);
                              }
                            }}
                          />
                        </div>
                      );
                    }}
                  />
                  {driverForm.formState.errors.licenseExpiryDate && (
                    <p className="text-red-500 text-xs">
                      {driverForm.formState.errors.licenseExpiryDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="yearsExperience">Số năm kinh nghiệm *</label>
                  <Controller
                    name="yearsExperience"
                    control={driverForm.control}
                    render={({ field }) => (
                      <>
                        <input
                          className={`border rounded-md p-2 ${
                            driverForm.formState.errors.yearsExperience
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          id="yearsExperience"
                          {...field}
                          placeholder="5"
                        />
                        {driverForm.formState.errors.yearsExperience && (
                          <p className="text-red-500 text-xs">
                            {
                              driverForm.formState.errors.yearsExperience
                                .message
                            }
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              {formWantsHire && (
                <div className="space-y-1 flex flex-col">
                  <label>Gói dịch vụ Lái hộ *</label>
                  <Controller
                    name="services"
                    control={driverForm.control}
                    render={({ field }) => (
                      <>
                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          {services.map((service) => {
                            const isChecked = (
                              (field.value || []) as string[]
                            ).includes(service.id);
                            return (
                              <div
                                key={service.id}
                                className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                                  isChecked
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => {
                                  const newSelection = isChecked
                                    ? (field.value || []).filter(
                                        (v) => v !== service.id,
                                      )
                                    : [...(field.value || []), service.id];
                                  field.onChange(newSelection);
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  <input
                                    className="border border-gray-300 rounded-sm p-2 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                  />
                                  <div className="space-y-1 flex flex-col w-full">
                                    <div className="font-medium">
                                      {service.label}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {service.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {driverForm.formState.errors.services && (
                          <p className="text-red-500 text-xs mt-2">
                            {driverForm.formState.errors.services.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              )}

              {formWantsRide && (
                <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                  <h4 className="font-semibold">Thông tin xe Đặt xe *</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1 flex flex-col">
                      <label>Loại xe *</label>
                      <select
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.categoryCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          const cat = rideCategories.find(
                            (c) => c.code === code,
                          );
                          dispatch(
                            updateVehicle({
                              categoryCode: code,
                              seatCount: String(cat?.seatCount || 4),
                            }),
                          );
                        }}
                      >
                        <option value="">Chọn loại xe</option>
                        {rideCategories.map((cat) => (
                          <option key={cat.code} value={cat.code}>
                            {cat.name || cat.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label>Biển số *</label>
                      <input
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.plate}
                        onChange={(e) =>
                          dispatch(
                            updateVehicle({
                              plate: e.target.value.toUpperCase(),
                            }),
                          )
                        }
                        placeholder="51A12345"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label>Hãng xe *</label>
                      <input
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.brand}
                        onChange={(e) =>
                          dispatch(updateVehicle({ brand: e.target.value }))
                        }
                        placeholder="Toyota"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label>Màu xe *</label>
                      <input
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.color}
                        onChange={(e) =>
                          dispatch(updateVehicle({ color: e.target.value }))
                        }
                        placeholder="Trắng"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label>Dòng xe</label>
                      <input
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.model}
                        onChange={(e) =>
                          dispatch(updateVehicle({ model: e.target.value }))
                        }
                        placeholder="Vios"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label>Năm sản xuất</label>
                      <input
                        className="border rounded-md p-2 border-gray-300"
                        value={vehicleData.manufactureYear}
                        onChange={(e) =>
                          dispatch(
                            updateVehicle({
                              manufactureYear: e.target.value.replace(
                                /[^0-9]/g,
                                "",
                              ),
                            }),
                          )
                        }
                        placeholder="2020"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadCard
                  title="CCCD/CMND mặt trước *"
                  description="Chụp rõ nét mặt trước CCCD/CMND"
                  field="idFrontUrl"
                  uploadedUrl={documentsData.idFrontUrl}
                  uploading={uploadingState.idFrontUrl}
                  uploadError={uploadErrorState.idFrontUrl}
                />
                <FileUploadCard
                  title="CCCD/CMND mặt sau *"
                  description="Chụp rõ nét mặt sau CCCD/CMND"
                  field="idBackUrl"
                  uploadedUrl={documentsData.idBackUrl}
                  uploading={uploadingState.idBackUrl}
                  uploadError={uploadErrorState.idBackUrl}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadCard
                  title="CCCD điện tử VNeID *"
                  description="Ảnh CCCD điện tử xuất từ ứng dụng VNeID"
                  field="idVneidUrl"
                  uploadedUrl={documentsData.idVneidUrl}
                  uploading={uploadingState.idVneidUrl}
                  uploadError={uploadErrorState.idVneidUrl}
                />
                <FileUploadCard
                  title="Ảnh chân dung *"
                  description="Ảnh khuôn mặt rõ, chính diện, đủ ánh sáng"
                  field="portraitUrl"
                  uploadedUrl={documentsData.portraitUrl}
                  uploading={uploadingState.portraitUrl}
                  uploadError={uploadErrorState.portraitUrl}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadCard
                  title="Bằng lái xe mặt trước *"
                  description="Chụp rõ nét mặt trước bằng lái xe"
                  field="driverLicenseFrontUrl"
                  uploadedUrl={documentsData.driverLicenseFrontUrl}
                  uploading={uploadingState.driverLicenseFrontUrl}
                  uploadError={uploadErrorState.driverLicenseFrontUrl}
                />
                <FileUploadCard
                  title="Bằng lái xe mặt sau *"
                  description="Chụp rõ nét mặt sau bằng lái xe"
                  field="driverLicenseBackUrl"
                  uploadedUrl={documentsData.driverLicenseBackUrl}
                  uploading={uploadingState.driverLicenseBackUrl}
                  uploadError={uploadErrorState.driverLicenseBackUrl}
                />
              </div>

              {wantsRide && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Giấy tờ xe Đặt xe *</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(
                      [
                        [
                          "registrationUrl",
                          "registration",
                          "Cà vẹt / đăng ký xe *",
                        ],
                        ["inspectionUrl", "inspection", "Đăng kiểm"],
                        ["insuranceUrl", "insurance", "Bảo hiểm"],
                        ["vehiclePhotoUrl", "vehiclePhoto", "Ảnh xe *"],
                        ["platePhotoUrl", "platePhoto", "Ảnh biển số *"],
                      ] as const
                    ).map(([urlKey, fileKey, label]) => (
                      <div
                        key={urlKey}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                      >
                        <div className="text-sm font-medium mb-2">{label}</div>
                        {vehicleData[urlKey]?.startsWith("https://") ? (
                          <div className="space-y-2">
                            <img
                              src={vehicleData[urlKey]}
                              alt={label}
                              className="h-28 w-full object-cover rounded"
                            />
                            <button
                              type="button"
                              className="text-xs text-red-600"
                              onClick={() =>
                                dispatch(updateVehicle({ [urlKey]: "" }))
                              }
                            >
                              Xóa
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (!file.type.startsWith("image/")) {
                                toast.error("Vui lòng chọn file hình ảnh");
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("File không được vượt quá 5MB");
                                return;
                              }
                              try {
                                const res = await uploadVehicleDocuments({
                                  [fileKey]: file,
                                });
                                const data = res.data || {};
                                const mapped =
                                  data[urlKey as keyof typeof data] ||
                                  data[`${fileKey}Url` as keyof typeof data] ||
                                  Object.values(data).find(
                                    (v) =>
                                      typeof v === "string" &&
                                      v.startsWith("https://"),
                                  );
                                if (typeof mapped === "string") {
                                  dispatch(updateVehicle({ [urlKey]: mapped }));
                                } else {
                                  toast.error("Upload giấy tờ xe thất bại");
                                }
                              } catch (err: any) {
                                toast.error(
                                  err?.response?.data?.message ||
                                    "Upload giấy tờ xe thất bại",
                                );
                              }
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Yêu cầu về hình ảnh
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Hình ảnh phải rõ nét, đầy đủ thông tin, không bị mờ</li>
                  <li>Định dạng: JPG, PNG (tối đa 5MB mỗi file)</li>
                  <li>Bắt buộc có ảnh VNeID và ảnh chân dung khi gửi duyệt</li>
                  <li>Chụp thẳng, không bị nghiêng hoặc cắt góc</li>
                  <li>Không chấp nhận ảnh photocopy hoặc ảnh chụp màn hình</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6 mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Thông tin đã hoàn tất!
                </h3>
                <p className="text-green-700">
                  Vui lòng kiểm tra lại thông tin trước khi gửi đăng ký.
                </p>
              </div>
              <div className="border rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-lg mb-4">
                  📋 Tóm tắt thông tin đăng ký:
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">
                        {personalData.fullName || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium">
                        {personalData.phone || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {personalData.email || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">CCCD:</span>
                      <span className="font-medium">
                        {personalData.idNumber || "Chưa nhập"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Loại dịch vụ:</span>
                      <span className="font-medium">
                        {(driverData.driverTypes || [])
                          .map((t) =>
                            t === "DRIVER_FOR_HIRE" ? "Lái hộ" : "Đặt xe",
                          )
                          .join(", ") || "Chưa chọn"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Bằng lái:</span>
                      <span className="font-medium">
                        {driverData.licenseNumber || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Ngày hết hạn:</span>
                      <span className="font-medium">
                        {driverData.licenseExpiryDate || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Kinh nghiệm:</span>
                      <span className="font-medium">
                        {driverData.yearsExperience
                          ? `${driverData.yearsExperience} năm`
                          : "Chưa nhập"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 flex flex-col">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <div className="font-medium">
                    {addressData.streetAddress &&
                    addressData.ward &&
                    addressData.district &&
                    addressData.province
                      ? [
                          addressData.streetAddress,
                          wards.find((w) => w.idWard === addressData.ward)
                            ?.name || "",
                          districts.find(
                            (d) => d.idDistrict === addressData.district,
                          )?.name || "",
                          provinces.find(
                            (p) => p.idProvince === addressData.province,
                          )?.name || "",
                        ].join(", ")
                      : "Chưa nhập"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Dịch vụ:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {driverData.services.length > 0
                      ? driverData.services.map((serviceId) => {
                          const service = services.find(
                            (s) => s.id === serviceId,
                          );
                          return (
                            <span
                              key={serviceId}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {service?.label}
                            </span>
                          );
                        })
                      : "Chưa chọn dịch vụ"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tài liệu đã tải lên:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {documentsData.idFrontUrl?.startsWith("https://") && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ CCCD mặt trước
                      </span>
                    )}
                    {documentsData.idBackUrl?.startsWith("https://") && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ CCCD mặt sau
                      </span>
                    )}
                    {documentsData.driverLicenseFrontUrl?.startsWith(
                      "https://",
                    ) && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ Bằng lái mặt trước
                      </span>
                    )}
                    {documentsData.driverLicenseBackUrl?.startsWith(
                      "https://",
                    ) && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ Bằng lái mặt sau
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="bg-transparent text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Quay lại
            </button>
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={isContinueDisabled}
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
