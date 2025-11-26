import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Mail,
  Phone,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-400">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-white/90">
            SmartDrive cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            bạn
          </p>
          <p className="text-sm text-white/80 mt-2">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Chào mừng bạn đến với SmartDrive! Chúng tôi tôn trọng quyền riêng
              tư của bạn và cam kết bảo vệ thông tin cá nhân mà bạn cung cấp cho
              chúng tôi. Chính sách bảo mật này giải thích cách chúng tôi thu
              thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng
              dịch vụ SmartDrive.
            </p>
          </div>

          {/* Section 1 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  1. Thông tin chúng tôi thu thập
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1.1. Thông tin cá nhân
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Họ và tên</li>
                  <li>Số điện thoại</li>
                  <li>Địa chỉ email</li>
                  <li>Địa chỉ nhà/địa chỉ giao hàng</li>
                  <li>Thông tin thanh toán (được mã hóa và bảo mật)</li>
                  <li>Ảnh đại diện (nếu bạn cung cấp)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1.2. Thông tin sử dụng dịch vụ
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Lịch sử đặt xe và chuyến đi</li>
                  <li>Địa điểm đón và điểm đến</li>
                  <li>Thời gian và ngày sử dụng dịch vụ</li>
                  <li>Đánh giá và phản hồi về dịch vụ</li>
                  <li>Thông tin liên lạc với tài xế</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1.3. Thông tin thiết bị và công nghệ
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Địa chỉ IP</li>
                  <li>Loại thiết bị và hệ điều hành</li>
                  <li>Thông tin trình duyệt</li>
                  <li>Dữ liệu vị trí GPS (khi bạn cho phép)</li>
                  <li>Quyền truy cập camera (để chụp ảnh giấy tờ và avatar)</li>
                  <li>Cookies và công nghệ theo dõi tương tự</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1.4. Hình ảnh và tài liệu
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ảnh đại diện (avatar) của người dùng</li>
                  <li>
                    Ảnh giấy tờ tùy thân (CMND/CCCD, bằng lái xe) khi đăng ký
                    tài xế
                  </li>
                  <li>Ảnh phương tiện và giấy tờ xe (nếu có)</li>
                  <li>Các tài liệu xác minh danh tính khác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  2. Cách chúng tôi sử dụng thông tin
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cung cấp và cải thiện dịch vụ đặt tài xế</li>
                <li>Xử lý và quản lý các đặt chỗ của bạn</li>
                <li>Kết nối bạn với tài xế phù hợp</li>
                <li>Gửi thông báo về trạng thái chuyến đi</li>
                <li>Xử lý thanh toán và giao dịch</li>
                <li>
                  Gửi thông tin khuyến mãi và cập nhật dịch vụ (nếu bạn đồng ý)
                </li>
                <li>
                  Cải thiện trải nghiệm người dùng và phát triển tính năng mới
                </li>
                <li>Đảm bảo an toàn và ngăn chặn gian lận</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
                <li>Hỗ trợ khách hàng và giải quyết khiếu nại</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  3. Bảo mật thông tin
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ
                thông tin của bạn:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Mã hóa dữ liệu:</strong> Tất cả thông tin nhạy cảm
                  được mã hóa khi truyền và lưu trữ
                </li>
                <li>
                  <strong>Bảo mật hệ thống:</strong> Hệ thống của chúng tôi được
                  bảo vệ bằng tường lửa và các công nghệ bảo mật hiện đại
                </li>
                <li>
                  <strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy
                  quyền mới có thể truy cập thông tin cá nhân của bạn
                </li>
                <li>
                  <strong>Thanh toán an toàn:</strong> Thông tin thanh toán được
                  xử lý qua các cổng thanh toán bảo mật, chúng tôi không lưu trữ
                  thông tin thẻ tín dụng đầy đủ
                </li>
                <li>
                  <strong>Đào tạo nhân viên:</strong> Nhân viên của chúng tôi
                  được đào tạo về bảo mật thông tin và quyền riêng tư
                </li>
              </ul>
              <p className="mt-4">
                Tuy nhiên, không có phương thức truyền tải hoặc lưu trữ điện tử
                nào là 100% an toàn. Chúng tôi không thể đảm bảo an toàn tuyệt
                đối, nhưng chúng tôi cam kết bảo vệ thông tin của bạn bằng mọi
                cách có thể.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  4. Chia sẻ thông tin
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp
                sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Với tài xế:</strong> Chúng tôi chia sẻ thông tin cần
                  thiết (tên, số điện thoại, địa điểm) với tài xế được chỉ định
                  để họ có thể liên hệ và đón bạn
                </li>
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi có thể chia
                  sẻ thông tin với các đối tác cung cấp dịch vụ (như xử lý thanh
                  toán, phân tích dữ liệu) để hỗ trợ hoạt động của chúng tôi
                </li>
                <li>
                  <strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ
                  thông tin nếu được yêu cầu bởi cơ quan pháp luật hoặc để bảo
                  vệ quyền và an toàn của chúng tôi và người dùng khác
                </li>
                <li>
                  <strong>Với sự đồng ý của bạn:</strong> Chúng tôi sẽ chia sẻ
                  thông tin với bên thứ ba khác nếu bạn đồng ý rõ ràng
                </li>
              </ul>
              <p className="mt-4">
                Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân
                của bạn cho mục đích tiếp thị với bên thứ ba.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Quyền của bạn</h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Truy cập:</strong> Bạn có quyền yêu cầu xem thông tin
                  cá nhân mà chúng tôi lưu trữ về bạn
                </li>
                <li>
                  <strong>Chỉnh sửa:</strong> Bạn có thể cập nhật hoặc chỉnh sửa
                  thông tin cá nhân của mình trong ứng dụng hoặc bằng cách liên
                  hệ với chúng tôi
                </li>
                <li>
                  <strong>Xóa:</strong> Bạn có quyền yêu cầu xóa thông tin cá
                  nhân của mình, trừ khi chúng tôi có nghĩa vụ pháp lý phải giữ
                  lại
                </li>
                <li>
                  <strong>Từ chối:</strong> Bạn có thể từ chối nhận email quảng
                  cáo hoặc thông báo tiếp thị bằng cách cập nhật cài đặt trong
                  ứng dụng
                </li>
                <li>
                  <strong>Rút lại đồng ý:</strong> Bạn có thể rút lại sự đồng ý
                  về việc xử lý dữ liệu bất cứ lúc nào
                </li>
                <li>
                  <strong>Khiếu nại:</strong> Bạn có quyền khiếu nại với cơ quan
                  bảo vệ dữ liệu nếu bạn cho rằng quyền riêng tư của mình bị vi
                  phạm
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6 - Camera Access */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  6. Quyền truy cập camera và thiết bị
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Để cung cấp dịch vụ tốt nhất và đảm bảo tính xác thực,
                SmartDrive yêu cầu quyền truy cập camera của thiết bị của bạn
                trong các trường hợp sau:
              </p>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  6.1. Mục đích sử dụng camera
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Chụp ảnh đại diện (Avatar):</strong> Cho phép bạn
                    chụp ảnh để sử dụng làm ảnh đại diện trong tài khoản của
                    mình, giúp tài xế nhận diện bạn dễ dàng hơn.
                  </li>
                  <li>
                    <strong>Chụp ảnh giấy tờ khi đăng ký tài xế:</strong> Khi
                    bạn đăng ký trở thành đối tác tài xế, chúng tôi yêu cầu bạn
                    chụp ảnh các giấy tờ sau để xác minh danh tính và đảm bảo an
                    toàn:
                    <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                      <li>
                        Chứng minh nhân dân (CMND) hoặc Căn cước công dân (CCCD)
                      </li>
                      <li>Bằng lái xe (Giấy phép lái xe)</li>
                      <li>Giấy tờ xe (nếu có)</li>
                      <li>Các tài liệu xác minh khác theo yêu cầu</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  6.2. Cách chúng tôi sử dụng ảnh
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Xác minh danh tính:</strong> Ảnh giấy tờ được sử
                    dụng để xác minh danh tính và thông tin của bạn, đảm bảo
                    tính chính xác và an toàn của dịch vụ.
                  </li>
                  <li>
                    <strong>Bảo mật tài khoản:</strong> Ảnh đại diện giúp tăng
                    cường bảo mật và nhận diện người dùng.
                  </li>
                  <li>
                    <strong>Tuân thủ pháp luật:</strong> Lưu trữ thông tin giấy
                    tờ theo yêu cầu của cơ quan quản lý và pháp luật Việt Nam.
                  </li>
                  <li>
                    <strong>Không chia sẻ:</strong> Chúng tôi không chia sẻ ảnh
                    giấy tờ của bạn với bên thứ ba, trừ khi có yêu cầu từ cơ
                    quan pháp luật.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  6.3. Quyền kiểm soát của bạn
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Quyền từ chối:</strong> Bạn có quyền từ chối cấp
                    quyền truy cập camera. Tuy nhiên, điều này có thể hạn chế
                    một số chức năng của ứng dụng, đặc biệt là khi đăng ký tài
                    xế.
                  </li>
                  <li>
                    <strong>Quyền thay đổi:</strong> Bạn có thể thay đổi quyền
                    truy cập camera bất cứ lúc nào thông qua cài đặt của thiết
                    bị hoặc ứng dụng.
                  </li>
                  <li>
                    <strong>Quyền xóa:</strong> Bạn có thể yêu cầu xóa ảnh đã
                    tải lên bằng cách liên hệ với bộ phận hỗ trợ của chúng tôi.
                  </li>
                  <li>
                    <strong>Chỉ chụp khi cần:</strong> Ứng dụng chỉ truy cập
                    camera khi bạn chủ động chọn chức năng chụp ảnh, không tự
                    động chụp hoặc quay video.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">6.4. Bảo mật ảnh</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Mã hóa:</strong> Tất cả ảnh được mã hóa khi truyền
                    tải và lưu trữ trên máy chủ của chúng tôi.
                  </li>
                  <li>
                    <strong>Truy cập hạn chế:</strong> Chỉ nhân viên được ủy
                    quyền mới có thể truy cập ảnh giấy tờ của bạn để xác minh.
                  </li>
                  <li>
                    <strong>Lưu trữ an toàn:</strong> Ảnh được lưu trữ trên hệ
                    thống bảo mật cao với các biện pháp bảo vệ chống truy cập
                    trái phép.
                  </li>
                  <li>
                    <strong>Xóa sau khi xác minh:</strong> Sau khi hoàn tất quá
                    trình xác minh, một số ảnh có thể được xóa hoặc lưu trữ ở
                    định dạng ẩn danh theo quy định pháp luật.
                  </li>
                </ul>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Lưu ý quan trọng:</strong> Chúng tôi chỉ sử dụng
                  camera để chụp ảnh tĩnh khi bạn yêu cầu. Chúng tôi không quay
                  video, không truy cập vào thư viện ảnh của bạn mà không có sự
                  cho phép, và không sử dụng camera cho bất kỳ mục đích nào khác
                  ngoài những mục đích đã nêu ở trên.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 - Cookies */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  7. Cookies và công nghệ theo dõi
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Chúng tôi sử dụng cookies và công nghệ tương tự để cải thiện
                trải nghiệm của bạn:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Cookies cần thiết:</strong> Để ứng dụng hoạt động đúng
                  cách (đăng nhập, bảo mật)
                </li>
                <li>
                  <strong>Cookies phân tích:</strong> Để hiểu cách người dùng sử
                  dụng ứng dụng và cải thiện dịch vụ
                </li>
                <li>
                  <strong>Cookies chức năng:</strong> Để ghi nhớ tùy chọn và cài
                  đặt của bạn
                </li>
                <li>
                  <strong>Cookies quảng cáo:</strong> Để hiển thị quảng cáo phù
                  hợp (nếu bạn đồng ý)
                </li>
              </ul>
              <p className="mt-4">
                Bạn có thể quản lý hoặc xóa cookies thông qua cài đặt trình
                duyệt của mình. Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến
                chức năng của ứng dụng.
              </p>
            </div>
          </div>

          {/* Section 8 - Data Storage */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">8. Lưu trữ dữ liệu</h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần
                thiết để cung cấp dịch vụ và tuân thủ các nghĩa vụ pháp lý. Sau
                khi tài khoản của bạn bị xóa hoặc không còn hoạt động, chúng tôi
                sẽ xóa hoặc ẩn danh hóa thông tin của bạn theo quy định pháp
                luật.
              </p>
              <p>
                Một số thông tin có thể được giữ lại trong thời gian dài hơn nếu
                cần thiết cho mục đích pháp lý, giải quyết tranh chấp, hoặc thực
                thi thỏa thuận của chúng tôi.
              </p>
            </div>
          </div>

          {/* Section 9 - Children */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">9. Trẻ em</h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Dịch vụ SmartDrive dành cho người từ 18 tuổi trở lên. Chúng tôi
                không cố ý thu thập thông tin từ trẻ em dưới 18 tuổi. Nếu chúng
                tôi phát hiện rằng chúng tôi đã thu thập thông tin từ trẻ em mà
                không có sự đồng ý của phụ huynh, chúng tôi sẽ xóa thông tin đó
                ngay lập tức.
              </p>
            </div>
          </div>

          {/* Section 10 - Policy Changes */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  10. Thay đổi chính sách
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian
                để phản ánh các thay đổi trong thực tiễn, công nghệ hoặc yêu cầu
                pháp lý. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan
                trọng nào bằng cách đăng thông báo trên ứng dụng hoặc gửi email
                cho bạn.
              </p>
              <p>
                Chúng tôi khuyến khích bạn xem lại Chính sách bảo mật này định
                kỳ để luôn cập nhật về cách chúng tôi bảo vệ thông tin của bạn.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="w-8 h-8" />
              11. Liên hệ với chúng tôi
            </h2>
            <p className="mb-6 text-white/90">
              Nếu bạn có bất kỳ câu hỏi, mối quan tâm hoặc yêu cầu nào về Chính
              sách bảo mật này hoặc cách chúng tôi xử lý thông tin của bạn, vui
              lòng liên hệ với chúng tôi:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>Email: support@smartdrive.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>Hotline: 1900-xxxx (24/7)</span>
              </div>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-white/90 transition"
                >
                  <span>Quay lại trang chủ</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-slate-600 dark:text-slate-400 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p>
              Bằng việc sử dụng dịch vụ SmartDrive, bạn đồng ý với Chính sách
              bảo mật này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ
              của chúng tôi.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
