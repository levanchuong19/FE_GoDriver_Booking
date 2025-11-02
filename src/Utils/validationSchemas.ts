import { z } from "zod";

export const personalSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được vượt quá 50 ký tự")
    .regex(/^[\p{L}\s]+$/u, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được vượt quá 11 số")
    .regex(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(100, "Email không được vượt quá 100 ký tự"),
  idNumber: z
    .string()
    .min(9, "CMND/CCCD phải có ít nhất 9 số")
    .max(12, "CMND/CCCD không được vượt quá 12 số")
    .regex(/^\d+$/, "CMND/CCCD chỉ được chứa số"),
  gender: z.enum(["Nam", "Nữ"]),
});

export const addressSchema = z.object({
  province: z
    .string()
    .min(2, "Tỉnh/thành phố phải có ít nhất 2 ký tự")
    .max(50, "Tỉnh/thành phố không được vượt quá 50 ký tự"),
  district: z
    .string()
    .min(2, "Quận/huyện phải có ít nhất 2 ký tự")
    .max(50, "Quận/huyện không được vượt quá 50 ký tự"),
  ward: z
    .string()
    .min(2, "Phường/xã phải có ít nhất 2 ký tự")
    .max(50, "Phường/xã không được vượt quá 50 ký tự"),
  streetAddress: z
    .string()
    .min(5, "Địa chỉ cụ thể phải có ít nhất 5 ký tự")
    .max(100, "Địa chỉ cụ thể không được vượt quá 100 ký tự"),
});

export const driverSchema = z.object({
  licenseNumber: z
    .string()
    .min(5, "Số bằng lái xe phải có ít nhất 5 ký tự")
    .max(20, "Số bằng lái xe không được vượt quá 20 ký tự")
    .regex(/^[A-Z0-9]+$/, "Số bằng lái xe chỉ được chứa chữ cái in hoa và số"),
  licenseExpiryDate: z
    .string()
    .min(1, "Ngày hết hạn bằng lái là bắt buộc")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày hết hạn phải theo định dạng DD/MM/YYYY")
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        if (!day || !month || !year) return false;
        if (month < 1 || month > 12) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= daysInMonth;
      },
      "Ngày không hợp lệ cho tháng đã chọn"
    )
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        const expiryDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return expiryDate >= today;
      },
      "Ngày hết hạn không hợp lệ hoặc đã qua"
    )
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        const expiryDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixMonthsLater = new Date(today);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        sixMonthsLater.setHours(0, 0, 0, 0);
        return expiryDate >= sixMonthsLater;
      },
      "Bằng lái xe phải còn hiệu lực ít nhất 6 tháng"
    ),
  yearsExperience: z
    .string()
    .min(1, "Số năm kinh nghiệm là bắt buộc")
    .regex(/^\d+$/, "Số năm kinh nghiệm phải là số")
    .refine(
      (yearsStr) => {
        const years = parseInt(yearsStr);
        return years >= 0 && years <= 50;
      },
      "Số năm kinh nghiệm phải từ 0 đến 50"
    ),
  services: z
    .array(z.string())
    .min(1, "Phải chọn ít nhất một dịch vụ"),
});

export type PersonalFormData = z.infer<typeof personalSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;

