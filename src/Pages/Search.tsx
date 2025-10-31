import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Filter,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const drivers = [
  {
    id: 1,
    name: "Nguyễn Văn Minh",
    avatar:
      "https://thanhtra.com.vn/images/avatar-default.png?id=420048c5169f5847774bafb5e8b641b4",
    rating: 4.9,
    reviews: 127,
    experience: "5 năm",
    pricePerKm: 12000,
    pricePerHour: 150000,
    pricePerTrip: 250000,
    location: "Quận 1, TP.HCM",
    specialties: ["hourly", "vip"],
    available: true,
    description:
      "Tài xế chuyên nghiệp với 5 năm kinh nghiệm, am hiểu đường sá TP.HCM",
  },
  {
    id: 2,
    name: "Trần Thị Lan",
    avatar:
      "https://thanhtra.com.vn/images/avatar-default.png?id=420048c5169f5847774bafb5e8b641b4",
    rating: 4.8,
    reviews: 89,
    experience: "3 năm",
    pricePerKm: 14000,
    pricePerHour: 170000,
    pricePerTrip: 300000,
    location: "Quận 3, TP.HCM",
    specialties: ["hourly", "airport"],
    available: true,
    description:
      "Tài xế nữ chuyên nghiệp, phù hợp cho khách hàng nữ và gia đình có trẻ em",
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    avatar:
      "https://thanhtra.com.vn/images/avatar-default.png?id=420048c5169f5847774bafb5e8b641b4",
    rating: 4.7,
    reviews: 156,
    experience: "7 năm",
    pricePerKm: 15500,
    pricePerHour: 200000,
    pricePerTrip: 350000,
    location: "Quận 7, TP.HCM",
    specialties: ["long-distance", "vip"],
    available: false,
    description:
      "Chuyên gia lái xe đường dài, có kinh nghiệm phục vụ khách VIP",
  },
];

// Định nghĩa danh sách dịch vụ giống RegisterPartner.tsx
const services = [
  // {
  //   id: "hourly",
  //   label: "Lái xe theo giờ",
  //   description: "Dịch vụ lái xe trong thành phố",
  // },
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

export default function SearchPage() {
  const [date, setDate] = useState("");
  const [priceRange, setPriceRange] = useState([2000, 30000]);
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState("");

  // Hàm lọc tài xế
  const isFiltering =
    location ||
    selectedService ||
    priceRange[0] > 2000 ||
    priceRange[1] < 30000;

  const filteredDrivers = isFiltering
    ? drivers.filter((driver) => {
        // Lọc theo địa điểm (nếu có nhập)
        if (
          location &&
          !driver.location.toLowerCase().includes(location.toLowerCase())
        ) {
          return false;
        }
        // Lọc theo loại dịch vụ (nếu có chọn)
        if (
          selectedService &&
          !driver.specialties.some((s) =>
            s.toLowerCase().includes(selectedService.toLowerCase())
          )
        ) {
          return false;
        }
        // Lọc theo khoảng giá
        if (
          driver.pricePerKm < priceRange[0] ||
          driver.pricePerKm > priceRange[1]
        ) {
          return false;
        }
        return true;
      })
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm tài xế phù hợp
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và đặt lịch với tài xế chuyên nghiệp
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="mr-2 h-5 w-5" />
                <span className="text-lg font-semibold">Bộ lọc tìm kiếm</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Địa điểm
                  </label>
                  <input
                    id="location"
                    placeholder="Nhập địa điểm..."
                    className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày cần thuê
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại dịch vụ
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Khoảng giá (VNĐ/giờ)
                  </label>
                  <div className="px-2 py-4">
                    <input
                      type="range"
                      min={100000}
                      max={500000}
                      step={10000}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([+e.target.value, priceRange[1]])
                      }
                      className="w-full mb-2"
                    />
                    <input
                      type="range"
                      min={100000}
                      max={500000}
                      step={10000}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], +e.target.value])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{priceRange[0].toLocaleString()}đ</span>
                      <span>{priceRange[1].toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Tìm thấy {filteredDrivers.length} tài xế
              </p>
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => navigate("/map")}
                  className="bg-blue-600 cursor-pointer text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Xem trên bản đồ
                </button> */}
                <select className="w-48 px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price-low">Giá thấp nhất</option>
                  <option value="price-high">Giá cao nhất</option>
                  <option value="experience">Kinh nghiệm nhiều nhất</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredDrivers.map((driver) => (
                <>
                  {" "}
                  <div
                    key={driver.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={driver.avatar || "/placeholder.svg"}
                          alt={driver.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {driver.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {driver.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {(() => {
                                if (selectedService === "hourly") {
                                  return `${driver.pricePerKm.toLocaleString()}đ/km`;
                                } else if (
                                  selectedService === "vip" ||
                                  selectedService === "long-distance"
                                ) {
                                  return `${driver.pricePerHour.toLocaleString()}đ/giờ`;
                                } else if (selectedService === "airport") {
                                  return `${driver.pricePerTrip.toLocaleString()}đ/chuyến`;
                                } else {
                                  return `${driver.pricePerKm.toLocaleString()}đ/km`;
                                }
                              })()}
                            </div>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                driver.available
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {driver.available ? "Có sẵn" : "Bận"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(driver.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {driver.rating} ({driver.reviews} đánh giá)
                            </span>
                          </div>
                          <div className="ml-4 flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {driver.experience} kinh nghiệm
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          {driver.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {driver.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link to={`/booking/${driver.id}`} className="flex-1">
                            <button
                              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                              disabled={!driver.available}
                            >
                              Đặt lịch ngay
                            </button>
                          </Link>
                          <button className="flex items-center bg-transparent border border-gray-200 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                            <Phone className="h-4 w-4 mr-2" />
                            Gọi điện
                          </button>
                          <button className="flex items-center bg-transparent border border-gray-200 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Nhắn tin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                        disabled
                      >
                        Trước
                      </button>
                      <button className="px-4 py-2 rounded border border-blue-600 bg-blue-600 text-white font-semibold">
                        1
                      </button>
                      <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100">
                        2
                      </button>
                      <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100">
                        3
                      </button>
                      <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100">
                        Sau
                      </button>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
