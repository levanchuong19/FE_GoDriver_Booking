import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Filter,
  Car,
  Locate,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data cho tài xế trên bản đồ
const driversOnMap = [
  {
    id: 1,
    name: "Nguyễn Văn Minh",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 127,
    price: 150000,
    lat: 10.7769,
    lng: 106.7009,
    status: "available",
    distance: 0.5,
    eta: 3,
    vehicle: "Honda City",
    specialties: ["Lái xe an toàn", "Đúng giờ"],
  },
  {
    id: 2,
    name: "Trần Thị Lan",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 89,
    price: 140000,
    lat: 10.7829,
    lng: 106.6934,
    status: "available",
    distance: 1.2,
    eta: 5,
    vehicle: "Toyota Vios",
    specialties: ["Lái xe nữ", "Cẩn thận"],
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 156,
    price: 180000,
    lat: 10.7718,
    lng: 106.7147,
    status: "busy",
    distance: 0.8,
    eta: 4,
    vehicle: "Honda Accord",
    specialties: ["Đường dài", "VIP"],
  },
  {
    id: 4,
    name: "Phạm Minh Tuấn",
    avatar: "/placeholder.svg",
    rating: 4.6,
    reviews: 78,
    price: 135000,
    lat: 10.7756,
    lng: 106.7019,
    status: "available",
    distance: 0.3,
    eta: 2,
    vehicle: "Mazda 3",
    specialties: ["Thân thiện", "Nhiệt tình"],
  },
  {
    id: 5,
    name: "Võ Thị Hương",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 203,
    price: 160000,
    lat: 10.7812,
    lng: 106.6956,
    status: "available",
    distance: 1.5,
    eta: 7,
    vehicle: "Toyota Camry",
    specialties: ["Lái xe nữ", "VIP", "Kinh nghiệm"],
  },
];

type Driver = (typeof driversOnMap)[number];

export default function MapPage() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 10.7769,
    lng: 106.7009,
  });
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [priceRange, setPriceRange] = useState([100000, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef(null);

  // Simulate getting user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  const filteredDrivers: Driver[] = driversOnMap.filter((driver: Driver) => {
    if (serviceType !== "all") {
      const serviceMap: Record<string, string[]> = {
        hourly: ["Lái xe an toàn", "Đúng giờ", "Thân thiện"],
        vip: ["VIP", "Kinh nghiệm"],
        female: ["Lái xe nữ"],
      };
      if (
        !driver.specialties.some((s) => serviceMap[serviceType]?.includes(s))
      ) {
        return false;
      }
    }
    return driver.price >= priceRange[0] && driver.price <= priceRange[1];
  });

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setMapCenter({ lat: driver.lat, lng: driver.lng });
  };

  const handleBookDriver = (driverId: number) => {
    window.location.href = `/booking/${driverId}?pickup=${encodeURIComponent(
      pickupLocation
    )}&destination=${encodeURIComponent(destination)}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      {/* <header className="border-b bg-white z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DriveHire</span>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              className="bg-transparent border border-gray-300 rounded px-3 py-1 flex items-center text-gray-700 hover:bg-gray-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Bộ lọc
            </button>
            <Link to="/search">
              <button className="bg-transparent border border-gray-300 rounded px-3 py-1 text-gray-700 hover:bg-gray-100">
                Danh sách
              </button>
            </Link>
          </div>
        </div>
      </header> */}

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Search Section */}
          <div className="p-4 border-b">
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                <input
                  placeholder="Điểm đón..."
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-600" />
                <input
                  placeholder="Điểm đến..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                <Search className="h-4 w-4 mr-2" />
                Tìm tài xế
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 border-b bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại dịch vụ
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="hourly">Theo giờ</option>
                    <option value="vip">VIP</option>
                    <option value="female">Tài xế nữ</option>
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
                      max={300000}
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
                      max={300000}
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
              </div>
            </div>
          )}

          {/* Driver List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Tài xế gần bạn</h3>
                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                  {filteredDrivers.length} tài xế
                </span>
              </div>
              <div className="space-y-3">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className={`bg-white rounded-lg shadow-md cursor-pointer transition-all hover:shadow-md p-4 ${
                      selectedDriver?.id === driver.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={driver.avatar || "/placeholder.svg"}
                          alt={driver.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            driver.status === "available"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {driver.name}
                          </h4>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              driver.status === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {driver.status === "available" ? "Sẵn sàng" : "Bận"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>
                            {driver.rating} ({driver.reviews})
                          </span>
                          <span className="mx-2">•</span>
                          <span>{driver.distance}km</span>
                          <span className="mx-2">•</span>
                          <span>{driver.eta} phút</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            {driver.vehicle}
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            {driver.price.toLocaleString()}đ/h
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {driver.specialties
                            .slice(0, 2)
                            .map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {specialty}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div
            ref={mapRef}
            className="w-full h-full bg-gray-100 relative overflow-hidden"
          >
            {/* Map Background with Streets */}
            <div className="absolute inset-0">
              {/* Base map color */}
              <div className="w-full h-full bg-gray-100">
                {/* Street grid */}
                <svg
                  className="w-full h-full absolute inset-0"
                  viewBox="0 0 800 600"
                >
                  {/* Major roads */}
                  <line
                    x1="0"
                    y1="200"
                    x2="800"
                    y2="200"
                    stroke="#d1d5db"
                    strokeWidth="4"
                  />
                  <line
                    x1="0"
                    y1="400"
                    x2="800"
                    y2="400"
                    stroke="#d1d5db"
                    strokeWidth="4"
                  />
                  <line
                    x1="200"
                    y1="0"
                    x2="200"
                    y2="600"
                    stroke="#d1d5db"
                    strokeWidth="4"
                  />
                  <line
                    x1="400"
                    y1="0"
                    x2="400"
                    y2="600"
                    stroke="#d1d5db"
                    strokeWidth="4"
                  />
                  <line
                    x1="600"
                    y1="0"
                    x2="600"
                    y2="600"
                    stroke="#d1d5db"
                    strokeWidth="4"
                  />

                  {/* Minor roads */}
                  <line
                    x1="0"
                    y1="100"
                    x2="800"
                    y2="100"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="0"
                    y1="300"
                    x2="800"
                    y2="300"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="0"
                    y1="500"
                    x2="800"
                    y2="500"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="100"
                    y1="0"
                    x2="100"
                    y2="600"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="300"
                    y1="0"
                    x2="300"
                    y2="600"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="500"
                    y1="0"
                    x2="500"
                    y2="600"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="700"
                    y1="0"
                    x2="700"
                    y2="600"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Parks/Green areas */}
                  <rect
                    x="50"
                    y="50"
                    width="100"
                    height="80"
                    fill="#dcfce7"
                    rx="8"
                  />
                  <rect
                    x="650"
                    y="450"
                    width="120"
                    height="100"
                    fill="#dcfce7"
                    rx="8"
                  />

                  {/* Buildings */}
                  <rect
                    x="250"
                    y="120"
                    width="80"
                    height="60"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    rx="4"
                  />
                  <rect
                    x="450"
                    y="250"
                    width="100"
                    height="80"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    rx="4"
                  />
                  <rect
                    x="150"
                    y="350"
                    width="90"
                    height="70"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    rx="4"
                  />
                </svg>
              </div>
            </div>

            {/* User Location Marker */}
            <div
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-30"></div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Vị trí của bạn
                </div>
              </div>
            </div>

            {/* Driver Markers */}
            {filteredDrivers.map((driver, index) => {
              // Calculate positions around the user location
              const positions = [
                { x: 45, y: 35 }, // Top-left
                { x: 65, y: 25 }, // Top-right
                { x: 35, y: 60 }, // Bottom-left
                { x: 70, y: 70 }, // Bottom-right
                { x: 25, y: 45 }, // Left
                { x: 75, y: 40 }, // Right
                { x: 50, y: 20 }, // Top
                { x: 55, y: 80 }, // Bottom
              ];

              const position = positions[index % positions.length];
              const isSelected = selectedDriver?.id === driver.id;

              return (
                <div
                  key={driver.id}
                  className={`absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    isSelected ? "scale-110 z-40" : "hover:scale-105"
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  onClick={() => handleDriverSelect(driver)}
                >
                  <div className="relative">
                    {/* Driver Car Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-3 transition-all ${
                        driver.status === "available"
                          ? isSelected
                            ? "bg-blue-600 border-blue-200"
                            : "bg-white border-green-500 hover:border-green-600"
                          : "bg-gray-100 border-gray-400"
                      }`}
                    >
                      <Car
                        className={`h-6 w-6 ${
                          driver.status === "available"
                            ? isSelected
                              ? "text-white"
                              : "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Status Indicator */}
                    <div
                      className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        driver.status === "available"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />

                    {/* Price Tag */}
                    <div
                      className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-md ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      {driver.price.toLocaleString()}đ/h
                    </div>

                    {/* Distance Badge */}
                    <div
                      className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        isSelected
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {driver.distance}km
                    </div>

                    {/* Pulse animation for available drivers */}
                    {driver.status === "available" && !isSelected && (
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pickup Location (if set) */}
            {pickupLocation && (
              <div
                className="absolute z-25 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: "30%",
                  top: "30%",
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-green-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Điểm đón
                  </div>
                </div>
              </div>
            )}

            {/* Destination (if set) */}
            {destination && (
              <div
                className="absolute z-25 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: "70%",
                  top: "70%",
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Điểm đến
                  </div>
                </div>
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
              <button
                className="w-10 h-10 p-0 bg-white shadow-md hover:shadow-lg"
                onClick={() => setZoom(Math.min(zoom + 1, 20))}
              >
                <span className="text-lg font-bold">+</span>
              </button>
              <button
                className="w-10 h-10 p-0 bg-white shadow-md hover:shadow-lg"
                onClick={() => setZoom(Math.max(zoom - 1, 10))}
              >
                <span className="text-lg font-bold">−</span>
              </button>
              <button
                className="w-10 h-10 p-0 bg-white shadow-md hover:shadow-lg"
                onClick={() => {
                  setMapCenter(userLocation);
                  setSelectedDriver(null);
                }}
                title="Về vị trí của tôi"
              >
                <Locate className="h-4 w-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-30 border">
              <div className="text-xs font-semibold mb-3 text-gray-800">
                Chú thích
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border border-white shadow-sm" />
                  <span className="text-gray-700">Vị trí của bạn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-sm flex items-center justify-center">
                    <Car className="h-2 w-2 text-green-600" />
                  </div>
                  <span className="text-gray-700">Tài xế sẵn sàng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded-full shadow-sm flex items-center justify-center">
                    <Car className="h-2 w-2 text-gray-400" />
                  </div>
                  <span className="text-gray-700">Tài xế bận</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-gray-700">Điểm đón</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span className="text-gray-700">Điểm đến</span>
                </div>
              </div>
            </div>

            {/* Driver Count Badge */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-30 border">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-800">
                  {
                    filteredDrivers.filter((d) => d.status === "available")
                      .length
                  }{" "}
                  tài xế sẵn sàng
                </span>
              </div>
            </div>
          </div>

          {/* Driver Detail Card */}
          {selectedDriver && (
            <div className="absolute bottom-4 right-4 w-80 z-40">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Chi tiết tài xế</span>
                  <button
                    className="bg-transparent border-none p-1 rounded hover:bg-gray-100"
                    onClick={() => setSelectedDriver(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedDriver.avatar || "/placeholder.svg"}
                    alt={selectedDriver.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedDriver.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>
                        {selectedDriver.rating} ({selectedDriver.reviews} đánh
                        giá)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedDriver.vehicle}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {selectedDriver.distance}km
                    </div>
                    <div className="text-xs text-gray-600">Khoảng cách</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedDriver.eta} phút
                    </div>
                    <div className="text-xs text-gray-600">Thời gian đến</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {selectedDriver.price.toLocaleString()}đ
                    </div>
                    <div className="text-xs text-gray-600">Giá/giờ</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDriver.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                    onClick={() => handleBookDriver(selectedDriver.id)}
                    disabled={selectedDriver.status !== "available"}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Đặt lịch
                  </button>
                  <button className="bg-transparent border border-gray-300 rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="bg-transparent border border-gray-300 rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
