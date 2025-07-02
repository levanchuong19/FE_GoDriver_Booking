import { useState } from "react";
import {
  Car,
  Upload,
  User,
  FileText,
  CheckCircle,
  MapPin,
  Camera,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Dữ liệu địa chỉ Việt Nam (mẫu)
const provinces = [
  { code: "79", name: "TP. Hồ Chí Minh" },
  { code: "01", name: "Hà Nội" },
  { code: "48", name: "Đà Nẵng" },
  { code: "92", name: "Cần Thơ" },
  { code: "31", name: "Hải Phòng" },
];

const districts = {
  "79": [
    { code: "760", name: "Quận 1" },
    { code: "761", name: "Quận 2" },
    { code: "762", name: "Quận 3" },
    { code: "763", name: "Quận 4" },
    { code: "764", name: "Quận 5" },
    { code: "765", name: "Quận 6" },
    { code: "766", name: "Quận 7" },
    { code: "767", name: "Quận 8" },
    { code: "768", name: "Quận 9" },
    { code: "769", name: "Quận 10" },
    { code: "770", name: "Quận 11" },
    { code: "771", name: "Quận 12" },
    { code: "772", name: "Quận Bình Thạnh" },
    { code: "773", name: "Quận Gò Vấp" },
    { code: "774", name: "Quận Phú Nhuận" },
    { code: "775", name: "Quận Tân Bình" },
    { code: "776", name: "Quận Tân Phú" },
    { code: "777", name: "Quận Thủ Đức" },
    { code: "778", name: "Huyện Bình Chánh" },
    { code: "779", name: "Huyện Cần Giờ" },
    { code: "780", name: "Huyện Củ Chi" },
    { code: "781", name: "Huyện Hóc Môn" },
    { code: "782", name: "Huyện Nhà Bè" },
  ],
};

const wards = {
  "760": [
    { code: "26734", name: "Phường Bến Nghé" },
    { code: "26737", name: "Phường Bến Thành" },
    { code: "26740", name: "Phường Cầu Kho" },
    { code: "26743", name: "Phường Cầu Ông Lãnh" },
    { code: "26746", name: "Phường Cô Giang" },
    { code: "26749", name: "Phường Đa Kao" },
    { code: "26752", name: "Phường Nguyễn Cư Trinh" },
    { code: "26755", name: "Phường Nguyễn Thái Bình" },
    { code: "26758", name: "Phường Phạm Ngũ Lão" },
    { code: "26761", name: "Phường Tân Định" },
  ],
};

interface UploadedFile {
  file: File;
  preview: string;
  name: string;
}

export default function RegisterPartner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    fullName: "",
    phone: "",
    email: "",
    cccd: "",

    // Địa chỉ chi tiết
    specificAddress: "",
    province: "",
    district: "",
    ward: "",
    latitude: "",
    longitude: "",

    // Thông tin tài xế
    licenseNumber: "",
    licenseExpiry: "",
    experience: "",
    services: [] as string[],
    servicePrices: {} as Record<string, string>,

    // Tài liệu
    cccdFront: null as UploadedFile | null,
    cccdBack: null as UploadedFile | null,
    licenseFront: null as UploadedFile | null,
    licenseBack: null as UploadedFile | null,

    // Đồng ý
    termsAccepted: false,
    backgroundCheckConsent: false,
  });

  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  const [availableWards, setAvailableWards] = useState<any[]>([]);

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
      label: "Lái xe đường dài",
      description: "Chuyến đi liên tỉnh, du lịch",
    },
    {
      id: "vip",
      label: "Dịch vụ VIP",
      description: "Phục vụ khách hàng cao cấp",
    },
    {
      id: "airport",
      label: "Tài xế đưa đón sân bay",
      description: "Chuyên đưa đón sân bay",
    },
  ];

  const handleProvinceChange = (provinceCode: string) => {
    setFormData({
      ...formData,
      province: provinceCode,
      district: "",
      ward: "",
    });
    setAvailableDistricts(
      districts[provinceCode as keyof typeof districts] || []
    );
    setAvailableWards([]);
  };

  const handleDistrictChange = (districtCode: string) => {
    setFormData({ ...formData, district: districtCode, ward: "" });
    setAvailableWards(wards[districtCode as keyof typeof wards] || []);
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

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
        (error) => {
          alert("Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký trở thành tài xế
          </h1>
          <p className="text-gray-600">
            Tham gia cộng đồng tài xế chuyên nghiệp của chúng tôi
          </p>
        </div>

        {/* Progress Bar */}
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

        <div className="bg-white border border-gray-200 rounded-lg p-4">
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

          {/* Step 1: Thông tin cá nhân */}
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

          {/* Step 2: Địa chỉ */}
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
                      <option key={province.code} value={province.code}>
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
                      <option key={district.code} value={district.code}>
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
                      <option key={ward.code} value={ward.code}>
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
                  className="bg-transparent border border-gray-300 rounded-md p-2 flex items-center cursor-pointer"
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
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mở Google Maps, tìm địa chỉ của bạn</li>
                  <li>• Click chuột phải vào vị trí chính xác</li>
                  <li>
                    • Chọn tọa độ đầu tiên trong menu (VD: 10.7769, 106.7009)
                  </li>
                  <li>• Sao chép và dán vào các ô trên</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Thông tin tài xế */}
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
                    placeholder="123456789"
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
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        formData.services.includes(service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          className="border border-gray-300 rounded-md p-2"
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="space-y-1 flex flex-col">
                          <div className="font-medium">{service.label}</div>
                          <div className="text-sm text-gray-600">
                            {service.description}
                          </div>
                        </div>
                      </div>
                      {formData.services.includes(service.id) && (
                        <div className="mt-4">
                          <label className="block text-sm mb-1">
                            {service.id === "hourly"
                              ? "Giá theo giờ (VNĐ/giờ) *"
                              : "Giá theo km (VNĐ/km) *"}
                          </label>
                          <input
                            className="border border-gray-300 rounded-md p-2 w-full"
                            type="number"
                            value={formData.servicePrices[service.id] || ""}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                servicePrices: {
                                  ...prev.servicePrices,
                                  [service.id]: e.target.value,
                                },
                              }));
                            }}
                            placeholder={
                              service.id === "hourly"
                                ? "Nhập giá theo giờ (VD: 150000)"
                                : "Nhập giá theo km (VD: 10000)"
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Tài liệu */}
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
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Hình ảnh phải rõ nét, đầy đủ thông tin, không bị mờ</li>
                  <li>• Định dạng: JPG, PNG (tối đa 5MB mỗi file)</li>
                  <li>• Chụp thẳng, không bị nghiêng hoặc cắt góc</li>
                  <li>
                    • Thông tin trên giấy tờ phải khớp với thông tin đã khai báo
                  </li>
                  <li>
                    • Không chấp nhận ảnh photocopy hoặc ảnh chụp màn hình
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Hoàn tất */}
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
                    {formData.specificAddress},{" "}
                    {provinces.find((p) => p.code === formData.province)?.name},{" "}
                    {
                      availableDistricts.find(
                        (d) => d.code === formData.district
                      )?.name
                    }
                    ,{" "}
                    {availableWards.find((w) => w.code === formData.ward)?.name}
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
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {service?.label}
                          {formData.servicePrices[serviceId] && (
                            <span className="ml-1 text-xs text-blue-700">
                              - {formData.servicePrices[serviceId]}đ
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
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ CCCD mặt trước
                      </span>
                    )}
                    {formData.cccdBack && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ CCCD mặt sau
                      </span>
                    )}
                    {formData.licenseFront && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Bằng lái mặt trước
                      </span>
                    )}
                    {formData.licenseBack && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Bằng lái mặt sau
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="background"
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

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="bg-transparent text-gray-600 border border-gray-300 rounded-md p-2"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Quay lại
            </button>
            <div className="flex space-x-3 bg-blue-600 text-white rounded-md p-2">
              {currentStep < 5 ? (
                <button onClick={nextStep}>Tiếp tục</button>
              ) : (
                <button
                  disabled={
                    !formData.termsAccepted || !formData.backgroundCheckConsent
                  }
                  className="text-white"
                >
                  Gửi đăng ký
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
