import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter 
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-sky-50 min-h-screen pb-20">
      {/* 1. HEADER SECTION */}
      <div className="bg-white border-b border-sky-100">
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Liên hệ với <span className="text-sky-500">Ha Long Stay</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy để lại tin nhắn hoặc ghé thăm văn phòng của chúng tôi tại Bãi Cháy.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* 2. LEFT COLUMN: Thông tin liên hệ */}
          <Card className="lg:col-span-1 shadow-xl shadow-sky-100 border-0 h-fit z-10 bg-white">
            <CardContent className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-800">Thông tin liên lạc</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Văn phòng chính</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Cảng tàu khách quốc tế Hạ Long, <br />Bãi Cháy, TP. Hạ Long, Quảng Ninh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Hotline</p>
                      <p className="text-sm text-slate-500 mt-1">0987 654 321</p>
                      <p className="text-xs text-sky-500 font-medium">(Hỗ trợ đặt phòng 24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-500 mt-1">support@halongstay.com</p>
                      <p className="text-sm text-slate-500">booking@halongstay.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Giờ làm việc</p>
                      <p className="text-sm text-slate-500 mt-1">Thứ 2 - Chủ Nhật</p>
                      <p className="text-sm text-slate-500">8:00 - 20:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-sky-100" />

              <div>
                <h4 className="font-semibold mb-4 text-slate-800">Mạng xã hội</h4>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full border-sky-200 text-sky-600 hover:text-white hover:bg-sky-600 hover:border-sky-600 transition">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-sky-200 text-pink-600 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-sky-200 text-sky-400 hover:text-white hover:bg-sky-400 hover:border-sky-400 transition">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. RIGHT COLUMN: Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Card */}
            <Card className="shadow-xl shadow-sky-100 border-0 z-10 bg-white">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Gửi thắc mắc cho chúng tôi</h3>
                  <p className="text-slate-500">Vui lòng điền vào biểu mẫu dưới đây, đội ngũ Ha Long Stay sẽ phản hồi sớm nhất.</p>
                </div>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                      <Input placeholder="Nhập họ tên của bạn" className="bg-sky-50/50 border-sky-100 focus:ring-sky-200 focus:border-sky-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <Input placeholder="email@example.com" type="email" className="bg-sky-50/50 border-sky-100 focus:ring-sky-200 focus:border-sky-400" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                      <Input placeholder="0912..." className="bg-sky-50/50 border-sky-100 focus:ring-sky-200 focus:border-sky-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Chủ đề</label>
                      <Input placeholder="Vấn đề cần hỗ trợ..." className="bg-sky-50/50 border-sky-100 focus:ring-sky-200 focus:border-sky-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nội dung tin nhắn</label>
                    <Textarea 
                      placeholder="Chi tiết yêu cầu của bạn..." 
                      className="min-h-[150px] bg-sky-50/50 border-sky-100 resize-none focus:ring-sky-200 focus:border-sky-400" 
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button size="lg" className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200">
                      <Send className="w-4 h-4 mr-2" /> Gửi tin nhắn
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Map Embed (Tọa độ Hạ Long) */}
            <div className="rounded-xl overflow-hidden shadow-lg shadow-sky-100 h-[300px] border border-sky-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59587.97785449839!2d107.00983050020353!3d20.973365314777247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5796f32a6a19%3A0x42f2b3e8c713b1f0!2zVHAuIEjhuqEgTG9uZywgUXXhuqNuZyBOaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1705290000000!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}