import { Star, Shield, Clock, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Thuê tài xế chuyên nghiệp
            <span className="text-blue-600 block">an toàn & tiện lợi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Kết nối bạn với những tài xế có kinh nghiệm, được xác minh và đánh
            giá cao. Dịch vụ lái xe hộ 24/7 trên toàn quốc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <button className="text-lg px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center">
                <MapPin className="mr-2 h-5 w-5" />
                Tìm tài xế ngay
              </button>
            </Link>
            <Link to="/driver/register">
              <button className="text-lg px-6 py-3 rounded border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" />
                Trở thành tài xế
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Tài xế đã đăng ký</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Chuyến đi hoàn thành</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">Đánh giá trung bình</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Đa dạng dịch vụ phù hợp với mọi nhu cầu
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">Lái xe theo giờ</div>
              <div className="text-gray-600 mb-2">
                Thuê tài xế theo giờ cho các chuyến đi ngắn
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                150,000đ/giờ
              </div>
              <p className="text-gray-600">Tối thiểu 2 giờ</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">Lái xe đường dài</div>
              <div className="text-gray-600 mb-2">
                Dịch vụ lái xe cho các chuyến đi xa
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                2,000đ/km
              </div>
              <p className="text-gray-600">Bao gồm phí nghỉ đêm</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">Lái xe VIP</div>
              <div className="text-gray-600 mb-2">
                Tài xế chuyên nghiệp cho khách VIP
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                300,000đ/giờ
              </div>
              <p className="text-gray-600">Dịch vụ cao cấp</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600">Đơn giản chỉ với 3 bước</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm tài xế</h3>
              <p className="text-gray-600">
                Nhập địa điểm và thời gian cần thuê tài xế
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Chọn tài xế</h3>
              <p className="text-gray-600">
                Xem hồ sơ, đánh giá và chọn tài xế phù hợp
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt lịch</h3>
              <p className="text-gray-600">
                Xác nhận đặt lịch và thanh toán an toàn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drivers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tài xế nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Những tài xế được đánh giá cao nhất
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-center"
              >
                <img
                  src="/placeholder.svg"
                  alt="Driver"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <div className="text-2xl font-bold mb-2">Nguyễn Văn A</div>
                <div className="text-gray-600 mb-2">
                  Tài xế chuyên nghiệp • 5 năm kinh nghiệm
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-2 text-sm text-gray-600">
                    4.9 (127 đánh giá)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Lái xe an toàn
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Đúng giờ
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600">150,000đ/giờ</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Tìm tài xế phù hợp ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <button className="text-lg px-6 py-3 rounded bg-white text-blue-600 hover:bg-blue-100 font-semibold">
                Tìm tài xế ngay
              </button>
            </Link>
            <Link to="/driver/register">
              <button className="text-lg px-6 py-3 rounded border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold">
                Đăng ký làm tài xế
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
