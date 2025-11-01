import { useEffect, useState } from "react";
import {
  Car,
  Upload,
  User,
  FileText,
  CheckCircle,
  MapPin,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UploadedFile {
  file: File;
  preview: string;
  name: string;
}

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  cccd: "",
  specificAddress: "",
  province: "",
  district: "",
  ward: "",
  latitude: "",
  longitude: "",
  licenseNumber: "",
  licenseExpiry: "",
  experience: "",
  services: [] as string[],
  cccdFront: null as UploadedFile | null,
  cccdBack: null as UploadedFile | null,
  licenseFront: null as UploadedFile | null,
  licenseBack: null as UploadedFile | null,
  termsAccepted: false,
  backgroundCheckConsent: false,
};

export default function RegisterPartner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  const [availableWards, setAvailableWards] = useState<any[]>([]);

  const [servicePrices, setServicePrices] = useState<{ [key: string]: string }>(
    {}
  );
  const [servicePriceErrors, setServicePriceErrors] = useState<{
    [key: string]: string;
  }>({});
  const [provinces, setProvinces] = useState<any[]>([]);
  const [, setDistricts] = useState<any[]>([]);
  const [, setWards] = useState<any[]>([]);

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

  const handleProvinceChange = (provinceId: string) => {
    setFormData({ ...formData, province: provinceId, district: "", ward: "" });
    setDistricts([]);
    setWards([]);

    fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          setAvailableDistricts(data.data);
        } else {
          console.error("Không thể tải quận/huyện:", data.error_text);
        }
      })
      .catch((err) => console.error("Lỗi tải quận/huyện:", err));
  };

  const handleDistrictChange = (districtId: string) => {
    setFormData({ ...formData, district: districtId, ward: "" });
    setWards([]);

    fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) {
          setAvailableWards(data.data);
        } else {
          console.error("Không thể tải phường/xã:", data.error_text);
        }
      })
      .catch((err) => console.error("Lỗi tải phường/xã:", err));
  };

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: User },
    { id: 2, title: "Địa chỉ", icon: MapPin },
    { id: 3, title: "Thông tin tài xế", icon: Car },
    { id: 4, title: "Tài liệu", icon: FileText },
    { id: 5, title: "Hoàn tất", icon: CheckCircle },
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

  // const handleProvinceChange = (provinceCode: string) => {
  //   setFormData({
  //     ...formData,
  //     province: provinceCode,
  //     district: "",
  //     ward: "",
  //   });
  //   setAvailableDistricts(districts[provinceCode] || []);
  //   setAvailableWards([]);
  // };

  // const handleDistrictChange = (districtCode: string) => {
  //   setFormData({ ...formData, district: districtCode, ward: "" });
  //   setAvailableWards(wards[districtCode] || []);
  // };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(serviceId);
      let newServices = isSelected
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId];
      // Nếu bỏ chọn thì xóa giá và lỗi
      if (isSelected) {
        const newPrices = { ...servicePrices };
        const newErrors = { ...servicePriceErrors };
        delete newPrices[serviceId];
        delete newErrors[serviceId];
        setServicePrices(newPrices);
        setServicePriceErrors(newErrors);
      }
      return {
        ...prev,
        services: newServices,
      };
    });
  };

  // // Hàm validate giá theo từng dịch vụ
  // const validateServicePrice = (serviceId: string, value: string) => {
  //   let num = Number(value);
  //   let error = "";
  //   switch (serviceId) {
  //     case "hourly":
  //       if (!value) error = "Vui lòng nhập giá";
  //       else if (isNaN(num) || num < 100000 || num >= 200000)
  //         error = "Giá phải từ 100.000 đến dưới 200.000";
  //       break;
  //     case "long-distance":
  //       if (!value) error = "Vui lòng nhập giá";
  //       else if (isNaN(num) || num < 2000 || num >= 10000)
  //         error = "Giá phải từ 2.000 đến dưới 10.000";
  //       break;
  //     case "per_km":
  //       if (!value) error = "Vui lòng nhập giá";
  //       else if (isNaN(num) || num < 1000000 || num >= 5000000)
  //         error = "Giá phải từ 1.000.000 đến dưới 5.000.000";
  //       break;
  //     case "daily":
  //       if (!value) error = "Vui lòng nhập giá";
  //       else if (isNaN(num) || num < 5000 || num > 20000)
  //         error = "Giá phải từ 5.000 đến 20.000";
  //       break;
  //     default:
  //       break;
  //   }
  //   return error;
  // };

  // const handleServicePriceChange = (serviceId: string, value: string) => {
  //   setServicePrices((prev) => ({ ...prev, [serviceId]: value }));
  //   const error = validateServicePrice(serviceId, value);
  //   setServicePriceErrors((prev) => ({ ...prev, [serviceId]: error }));
  // };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedFile: UploadedFile = {
        file,
        preview: e.target?.result as string,
        name: file.name,
      };
      setFormData({ ...formData, [field]: uploadedFile });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field: string) => {
    setFormData({ ...formData, [field]: null });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        () => {
          alert("Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setAvailableDistricts([]);
    setAvailableWards([]);
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const provinceName =
      provinces.find((p) => p.idProvince === formData.province)?.name || "";
    const districtName =
      availableDistricts.find((d) => d.idDistrict === formData.district)
        ?.name || "";
    const wardName =
      availableWards.find((w) => w.idCommune === formData.ward)?.name || "";

    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      cccd: formData.cccd,
      address: {
        specificAddress: formData.specificAddress,
        province: provinceName,
        district: districtName,
        ward: wardName,
      },
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      driverInfo: {
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        experience: formData.experience,
        services: formData.services.map((id) => ({
          label: services.find((s) => s.id === id)?.label,
          price: servicePrices[id] || null,
        })),
      },
      documents: {
        cccdFront: formData.cccdFront?.preview || null,
        cccdBack: formData.cccdBack?.preview || null,
        licenseFront: formData.licenseFront?.preview || null,
        licenseBack: formData.licenseBack?.preview || null,
      },
      consent: {
        termsAccepted: formData.termsAccepted,
        backgroundCheckConsent: formData.backgroundCheckConsent,
      },
    };

    try {
      const API_URL =
        "https://68662ffb89803950dbb19188.mockapi.io/api/DriverRegisForm";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gửi biểu mẫu thất bại. Vui lòng thử lại.");
      }
      await response.json();

      // console.log("Data: ", payload)
      resetForm();
      alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    } catch (error) {
      console.error("Lỗi khi gửi đăng ký:", error);
      resetForm();
      alert(
        (error as Error).message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại và kiểm tra lại thông tin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  const FileUploadCard = ({
    title,
    description,
    field,
    uploadedFile,
  }: {
    title: string;
    description: string;
    field: string;
    uploadedFile: UploadedFile | null;
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
      <div className="text-center">
        {uploadedFile ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={uploadedFile.preview || "/placeholder.svg"}
                alt={title}
                width={120}
                height={80}
                className="rounded-lg object-cover border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-800 text-white h-6 w-6 p-0 rounded-full flex items-center justify-center"
                onClick={() => removeFile(field)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="text-sm">
              <p className="font-medium text-green-600">✓ Đã tải lên</p>
              <p className="text-gray-600 truncate">{uploadedFile.name}</p>
            </div>
            <div className="flex flex-col items-center">
              <input
                id={`file-input-${field}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(field, e.target.files)}
                className="hidden"
              />
              <label
                htmlFor={`file-input-${field}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer text-sm mt-2"
              >
                Chọn lại file
              </label>
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
                onChange={(e) => handleFileUpload(field, e.target.files)}
                className="hidden"
              />
              <label
                htmlFor={`file-input-${field}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer text-sm mt-2"
              >
                Chọn file
              </label>
              <span className="block text-center text-gray-500 text-sm mt-2">
                Chưa chọn file nào
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-50  mt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký trở thành tài xế
          </h1>
          <p className="text-gray-600">
            Tham gia cộng đồng tài xế chuyên nghiệp của chúng tôi
          </p>
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
                "Vui lòng cung cấp thông tin cá nhân của bạn"}
              {currentStep === 2 && "Nhập địa chỉ chi tiết và tọa độ vị trí"}
              {currentStep === 3 &&
                "Thông tin về kinh nghiệm và dịch vụ lái xe"}
              {currentStep === 4 && "Tải lên các tài liệu cần thiết"}
              {currentStep === 5 && "Xem lại thông tin và hoàn tất đăng ký"}
            </p>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0901234567"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="email">Email *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="cccd">Số CCCD/CMND *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="cccd"
                    value={formData.cccd}
                    onChange={(e) =>
                      setFormData({ ...formData, cccd: e.target.value })
                    }
                    placeholder="001234567890"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label>Tỉnh/Thành phố *</label>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
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
                </div>
                <div className="space-y-1 flex flex-col">
                  <label>Quận/Huyện *</label>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!formData.province}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {availableDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 flex flex-col">
                  <label>Phường/Xã *</label>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={formData.ward}
                    onChange={(e) =>
                      setFormData({ ...formData, ward: e.target.value })
                    }
                    disabled={!formData.district}
                  >
                    <option value="">Chọn phường/xã</option>
                    {availableWards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1 flex flex-col">
                <label htmlFor="specificAddress">Địa chỉ cụ thể *</label>
                <input
                  className="border border-gray-300 rounded-md p-2"
                  id="specificAddress"
                  value={formData.specificAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specificAddress: e.target.value,
                    })
                  }
                  placeholder="Số nhà, tên đường..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="latitude">Vĩ độ (Latitude) *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="10.7769"
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="longitude">Kinh độ (Longitude) *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="106.7009"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="bg-transparent border border-gray-300 rounded-md p-2 flex items-center cursor-pointer hover:bg-gray-100"
                  onClick={getCurrentLocation}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Lấy vị trí hiện tại của bạn
                </button>
                <span className="text-sm text-gray-600">
                  Hoặc nhập tọa độ thủ công
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  💡 Cách lấy tọa độ:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Mở Google Maps, tìm địa chỉ của bạn</li>
                  <li>Click chuột phải vào vị trí chính xác</li>
                  <li>
                    Chọn tọa độ đầu tiên trong menu (VD: 10.7769, 106.7009)
                  </li>
                  <li>Sao chép và dán vào các ô trên</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="licenseNumber">Số bằng lái xe *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                    placeholder="0101457201280"
                  />
                </div>
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="licenseExpiry">Ngày hết hạn bằng lái *</label>
                  <input
                    className="border border-gray-300 rounded-md p-2"
                    id="licenseExpiry"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseExpiry: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label htmlFor="experience">Số năm kinh nghiệm *</label>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  >
                    <option value="">Chọn số năm kinh nghiệm</option>
                    <option value="1-2">1-2 năm</option>
                    <option value="3-5">3-5 năm</option>
                    <option value="6-10">6-10 năm</option>
                    <option value="10+">Trên 10 năm</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1 flex flex-col">
                <label>Dịch vụ cung cấp *</label>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  {services.map((service) => {
                    const isChecked = formData.services.includes(service.id);
                    return (
                      <div
                        key={service.id}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          isChecked
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            className="border border-gray-300 rounded-sm p-2 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                          />
                          <div className="space-y-1 flex flex-col w-full">
                            <div className="font-medium">{service.label}</div>
                            <div className="text-sm text-gray-600">
                              {service.description}
                            </div>
                            {/* {isChecked && (
                              <div className="mt-2">
                                <input
                                  type="number"
                                  className="border border-gray-300 rounded-md p-2 w-full"
                                  placeholder={placeholder}
                                  value={servicePrices[service.id] || ""}
                                  min={min}
                                  max={max}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    setServicePrices({
                                      ...servicePrices,
                                      [service.id]: e.target.value,
                                    })
                                  }
                                />
                                <span className="ml-2 text-xs text-gray-500">
                                  {unit}
                                </span>
                                {servicePriceErrors[service.id] && (
                                  <div className="text-red-500 text-xs mt-1">
                                    {servicePriceErrors[service.id]}
                                  </div>
                                )}
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadCard
                  title="CCCD/CMND mặt trước *"
                  description="Chụp rõ nét mặt trước CCCD/CMND"
                  field="cccdFront"
                  uploadedFile={formData.cccdFront}
                />
                <FileUploadCard
                  title="CCCD/CMND mặt sau *"
                  description="Chụp rõ nét mặt sau CCCD/CMND"
                  field="cccdBack"
                  uploadedFile={formData.cccdBack}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadCard
                  title="Bằng lái xe mặt trước *"
                  description="Chụp rõ nét mặt trước bằng lái xe"
                  field="licenseFront"
                  uploadedFile={formData.licenseFront}
                />
                <FileUploadCard
                  title="Bằng lái xe mặt sau *"
                  description="Chụp rõ nét mặt sau bằng lái xe"
                  field="licenseBack"
                  uploadedFile={formData.licenseBack}
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  📋 Yêu cầu về hình ảnh:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Hình ảnh phải rõ nét, đầy đủ thông tin, không bị mờ</li>
                  <li>Định dạng: JPG, PNG (tối đa 5MB mỗi file)</li>
                  <li>Chụp thẳng, không bị nghiêng hoặc cắt góc</li>
                  <li>
                    Thông tin trên giấy tờ phải khớp với thông tin đã khai báo
                  </li>
                  <li>Không chấp nhận ảnh photocopy hoặc ảnh chụp màn hình</li>
                </ul>
              </div>
            </div>
          )}

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
                      <span className="text-gray-600">Họ tên:</span>{" "}
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Điện thoại:</span>{" "}
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Email:</span>{" "}
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">CCCD:</span>{" "}
                      <span className="font-medium">{formData.cccd}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Bằng lái:</span>{" "}
                      <span className="font-medium">
                        {formData.licenseNumber}
                      </span>
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <span className="text-gray-600">Kinh nghiệm:</span>{" "}
                      <span className="font-medium">{formData.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 flex flex-col">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <div className="font-medium">
                    {`${formData.specificAddress}, ${
                      availableWards.find((w) => w.id === formData.ward)
                        ?.name || ""
                    }, ${
                      availableDistricts.find((d) => d.id === formData.district)
                        ?.name || ""
                    }, ${
                      provinces.find((p) => p.idProvince === formData.province)
                        ?.name || ""
                    }`}
                  </div>
                  <div className="text-sm text-gray-600">
                    Tọa độ: {formData.latitude}, {formData.longitude}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Dịch vụ:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.services.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      return (
                        <span
                          key={serviceId}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                        >
                          {service?.label}
                          {servicePrices[serviceId] && (
                            <span className="ml-1 text-xs text-gray-600">
                              -{" "}
                              {Number(
                                servicePrices[serviceId]
                              ).toLocaleString()}{" "}
                              VNĐ
                              {serviceId === "hourly"
                                ? "/giờ"
                                : serviceId === "long-distance" ||
                                  serviceId === "daily"
                                ? "/km"
                                : serviceId === "per_km"
                                ? "/chuyến"
                                : ""}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tài liệu đã tải lên:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {formData.cccdFront && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ CCCD mặt trước
                      </span>
                    )}
                    {formData.cccdBack && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ CCCD mặt sau
                      </span>
                    )}
                    {formData.licenseFront && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ Bằng lái mặt trước
                      </span>
                    )}
                    {formData.licenseBack && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs text-center">
                        ✓ Bằng lái mặt sau
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 mt-1 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termsAccepted: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="terms" className="text-sm">
                    Tôi đồng ý với{" "}
                    <Link to="#" className="text-blue-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link to="#" className="text-blue-600 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="background"
                    className="h-4 w-4 mt-1 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    checked={formData.backgroundCheckConsent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundCheckConsent: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="background" className="text-sm">
                    Tôi đồng ý cho phép kiểm tra lý lịch và xác minh thông tin
                    cá nhân
                  </label>
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
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.termsAccepted ||
                  !formData.backgroundCheckConsent ||
                  isSubmitting ||
                  formData.services.some(
                    (id) => !servicePrices[id] || !!servicePriceErrors[id]
                  )
                }
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
