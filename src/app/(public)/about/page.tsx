import Image from "next/link"; // Lưu ý: Nếu dùng ảnh thật hãy import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Gem, 
  Headphones, 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Users 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION: Giới thiệu chung + Hình ảnh */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Kết nối hành trình, <br />
              <span className="text-primary">Nâng tầm trải nghiệm</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              MyHotel không chỉ là một ứng dụng đặt phòng. Chúng tôi là người bạn đồng hành tin cậy, 
              giúp bạn tìm thấy "ngôi nhà thứ hai" hoàn hảo cho mọi chuyến đi, từ những chuyến công tác 
              vội vã đến những kỳ nghỉ dưỡng trong mơ.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/search">Đặt phòng ngay</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">Liên hệ hợp tác</Link>
              </Button>
            </div>
          </div>
          
          {/* Ảnh minh họa (Placeholder từ Unsplash) */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Hotel" 
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION: Các con số ấn tượng */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">10k+</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Khách sạn đối tác</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">500k+</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Khách hàng tin dùng</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">100+</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Thành phố</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">24/7</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Hỗ trợ khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION SECTION: Sứ mệnh & Tầm nhìn */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <HeartHandshake className="w-16 h-16 text-primary mx-auto opacity-20" />
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            "Chúng tôi tin rằng mỗi chuyến đi là một câu chuyện. Sứ mệnh của MyHotel là giúp bạn 
            viết nên câu chuyện đó một cách trọn vẹn nhất bằng việc cung cấp nơi ở tiện nghi, 
            giá cả minh bạch và công nghệ đặt phòng tiên tiến nhất."
          </p>
          <Separator className="w-24 mx-auto bg-primary/30" />
        </div>
      </section>

      {/* 4. FEATURES SECTION: Tại sao chọn MyHotel? */}
      <section className="bg-slate-900 text-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Tại sao chọn MyHotel?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Chúng tôi cam kết mang lại những giá trị tốt nhất cho chuyến đi của bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="bg-slate-800 border-slate-700 text-slate-100">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Gem className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Chất lượng hàng đầu</h3>
                <p className="text-slate-400">
                  Đối tác được kiểm duyệt kỹ lưỡng, đảm bảo tiêu chuẩn vệ sinh và tiện nghi tốt nhất.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-slate-800 border-slate-700 text-slate-100">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Thanh toán an toàn</h3>
                <p className="text-slate-400">
                  Hệ thống bảo mật đa lớp, cam kết không phí ẩn, hoàn tiền linh hoạt theo chính sách.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-slate-800 border-slate-700 text-slate-100">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hỗ trợ 24/7</h3>
                <p className="text-slate-400">
                  Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải quyết mọi vấn đề phát sinh mọi lúc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. TEAM/STORY: Câu chuyện thương hiệu (Optional) */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
             <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Our Team" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900">Đội ngũ của chúng tôi</h2>
            <p className="text-slate-600">
              Đằng sau MyHotel là đội ngũ kỹ sư, chuyên gia du lịch và những người đam mê xê dịch. 
              Chúng tôi khởi nghiệp vào năm 2024 với một giấc mơ đơn giản: Làm cho việc đi du lịch trở nên dễ dàng hơn.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Môi trường làm việc sáng tạo</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Đặt khách hàng làm trọng tâm</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Công nghệ dẫn đầu xu hướng</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}