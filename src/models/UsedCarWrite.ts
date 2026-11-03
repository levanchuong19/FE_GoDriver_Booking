export interface UsedCarWritePayload {
  vehicleType?: string;
  brandId?: string;
  modelId?: string;
  variantId?: string;
  title?: string;
  description?: string;
  manufactureYear?: number;
  mileage?: number;
  price?: number;
  negotiable?: boolean;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  condition?: string;
  provinceCode?: string;
  districtCode?: string;
  contactName?: string;
  contactPhone?: string;
  plateNumber?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: string[];
}

export const MERCEDES_S450_SEED = {
  vehicleType: "CAR",
  title: "MERCEDES-BENZ S450 2019",
  description: `CLASS – MERCEDES-BENZ S450 2019
8 năm tuổi nhưng mới chỉ chạy hơn 2 vạn km, bảo dưỡng full lịch sử hãng – có gì để chê!
▪️ Ngoại thất đen, nội thất nâu sang trọng
▪️ Odo hơn 2 vạn km
▪️ Nguyên bản toàn tập
▪️ Full lịch sử bảo dưỡng chính hãng
Một chiếc S-Class dành cho người thích xe chất, xe zin và giữ gìn kỹ!`,
  manufactureYear: 2019,
  mileage: 20000,
  price: 1850000000,
  negotiable: true,
  transmission: "AUTOMATIC",
  fuelType: "GASOLINE",
  bodyType: "SEDAN",
  condition: "EXCELLENT",
  exteriorColor: "Đen",
  interiorColor: "Nâu",
  features: [
    "Nguyên bản toàn tập",
    "Full lịch sử bảo dưỡng chính hãng",
    "Ngoại thất đen",
    "Nội thất nâu sang trọng",
    "Odo hơn 2 vạn km",
  ],
  imagePaths: [
    "/used-cars/mercedes-s450/01.jpg",
    "/used-cars/mercedes-s450/02.jpg",
    "/used-cars/mercedes-s450/03.jpg",
    "/used-cars/mercedes-s450/04.jpg",
    "/used-cars/mercedes-s450/05.jpg",
  ],
} as const;
