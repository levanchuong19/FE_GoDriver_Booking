import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Bỏ qua toast lỗi toàn cục (khi caller tự xử lý / gọi song song nhiều API). */
    skipErrorToast?: boolean;
  }
}
