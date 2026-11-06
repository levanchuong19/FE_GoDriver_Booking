import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Home,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDriverApplicationById } from "../../Config/driverApi";

export default function RegisterPartnerStatus() {
  const navigate = useNavigate();
  const { status, application } = useSelector(
    (state: RootState) =>
      state.driverRegistration || {
        status: "draft" as const,
        application: {},
      }
  );

  useEffect(() => {
    // Fetch latest application status if we have an ID
    if (application && "id" in application && application.id) {
      const fetchStatus = async () => {
        try {
          const response = await getDriverApplicationById(application.id!);
          if (response.success && response.data) {
            // Status will be updated by the component that calls this
          }
        } catch (error) {
          console.error("Error fetching application status:", error);
        }
      };
      fetchStatus();
    }
  }, [application]);

  const getStatusInfo = () => {
    // Always check status first
    if (status === "draft") {
      return {
        icon: FileText,
        iconColor: "#6c757d",
        title: "Bản nháp",
        subtitle: "Hồ sơ chưa được gửi",
        description: "Bạn có thể tiếp tục chỉnh sửa và gửi hồ sơ.",
        bgColor: "#e9ecef",
        textColor: "#495057",
      };
    }

    switch (application.state) {
      case "pending":
        return {
          icon: Clock,
          iconColor: "#f39c12",
          title: "Đang kiểm duyệt",
          subtitle: "Hồ sơ của bạn đang được kiểm duyệt",
          description:
            "Chúng tôi sẽ thông báo kết quả trong vòng 1-3 ngày làm việc qua email và ứng dụng.",
          bgColor: "#fff3cd",
          textColor: "#856404",
        };
      case "approved":
        return {
          icon: CheckCircle,
          iconColor: "#27ae60",
          title: "Đăng ký thành công",
          subtitle: "Chúc mừng! Bạn đã trở thành đối tác của SmartDrive",
          description: "Bạn có thể bắt đầu nhận đơn hàng ngay bây giờ.",
          bgColor: "#d4edda",
          textColor: "#155724",
        };
      case "rejected":
        return {
          icon: XCircle,
          iconColor: "#e74c3c",
          title: "Đăng ký bị từ chối",
          subtitle: "Hồ sơ của bạn chưa đáp ứng yêu cầu",
          description:
            (application as any).reason ||
            "Vui lòng kiểm tra lại thông tin và thử lại.",
          bgColor: "#f8d7da",
          textColor: "#721c24",
        };
      default:
        return {
          icon: FileText,
          iconColor: "#6EC1E4",
          title: "Hồ sơ đã gửi",
          subtitle: "Đang chờ kiểm duyệt",
          description:
            "Hồ sơ của bạn đã được gửi thành công và đang trong quá trình kiểm duyệt.",
          bgColor: "#d1ecf1",
          textColor: "#0c5460",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const handleContinueEditing = () => {
    navigate("/register-partner");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-50 mt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Card */}
        <div
          className="rounded-lg p-8 text-center mb-6"
          style={{ backgroundColor: statusInfo.bgColor }}
        >
          <div className="mb-6">
            <Icon size={64} color={statusInfo.iconColor} className="mx-auto" />
          </div>
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: statusInfo.textColor }}
          >
            {statusInfo.title}
          </h2>
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: statusInfo.textColor }}
          >
            {statusInfo.subtitle}
          </h3>
          <p
            className="text-base"
            style={{ color: statusInfo.textColor, opacity: 0.9 }}
          >
            {statusInfo.description}
          </p>
        </div>

        {/* Application Details */}
        {application && "id" in application && application.id && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
            <h3 className="text-xl font-bold mb-4">Chi tiết hồ sơ</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã hồ sơ:</span>
                <span className="font-semibold">
                  {"id" in application ? application.id : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian nộp:</span>
                <span className="font-semibold">
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-semibold">{statusInfo.title}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {status === "draft" || !application.state ? (
            <>
              <button
                onClick={handleContinueEditing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Tiếp tục chỉnh sửa
              </button>
            </>
          ) : application.state === "rejected" ? (
            <>
              <button
                onClick={handleContinueEditing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Đăng ký lại
              </button>
            </>
          ) : application.state === "approved" ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  🎉 Chúc mừng! Bạn đã được chấp nhận làm đối tác tài xế của
                  chúng tôi. Vui lòng đăng nhập vào hệ thống để bắt đầu nhận đơn
                  hàng.
                </p>
              </div>
            </>
          ) : null}

          <Link
            to="/"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md font-semibold text-center flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6 mt-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Cần hỗ trợ?</h3>
          <p className="text-gray-600 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về hồ sơ đăng ký, vui lòng liên hệ với
            chúng tôi:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-blue-600">smartdrive.vn@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">Hotline:</span>
              <span className="text-blue-600">0867845622</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
