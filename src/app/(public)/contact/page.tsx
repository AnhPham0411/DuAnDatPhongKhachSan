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
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* 1. HEADER SECTION */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy để lại tin nhắn hoặc ghé thăm văn phòng của MyHotel.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* 2. LEFT COLUMN: Thông tin liên hệ */}
          <Card className="lg:col-span-1 shadow-lg border-0 h-fit z-10">
            <CardContent className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Thông tin liên lạc</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Trụ sở chính</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Số 1 Đại Cồ Việt, <br />Hai Bà Trưng, Hà Nội
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Hotline</p>
                      <p className="text-sm text-slate-500 mt-1">1900 123 456</p>
                      <p className="text-xs text-slate-400">(Hỗ trợ 24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-500 mt-1">support@myhotel.vn</p>
                      <p className="text-sm text-slate-500">booking@myhotel.vn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Giờ làm việc</p>
                      <p className="text-sm text-slate-500 mt-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                      <p className="text-sm text-slate-500">Cuối tuần: 9:00 - 17:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">Theo dõi chúng tôi</h4>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600 hover:border-blue-600 transition">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:text-pink-600 hover:border-pink-600 transition">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:text-sky-500 hover:border-sky-500 transition">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. RIGHT COLUMN: Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Card */}
            <Card className="shadow-lg border-0 z-10">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Gửi thắc mắc cho chúng tôi</h3>
                  <p className="text-slate-500">Vui lòng điền vào biểu mẫu dưới đây, chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                </div>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Họ và tên</label>
                      <Input placeholder="Nhập họ tên của bạn" className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input placeholder="email@example.com" type="email" className="bg-slate-50" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Số điện thoại</label>
                      <Input placeholder="0912..." className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chủ đề</label>
                      <Input placeholder="Vấn đề cần hỗ trợ..." className="bg-slate-50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nội dung tin nhắn</label>
                    <Textarea 
                      placeholder="Chi tiết yêu cầu của bạn..." 
                      className="min-h-[150px] bg-slate-50 resize-none" 
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button size="lg" className="w-full md:w-auto">
                      <Send className="w-4 h-4 mr-2" /> Gửi tin nhắn
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Map Embed (Google Map đại diện khu Bách Khoa) */}
            <div className="rounded-xl overflow-hidden shadow-md h-[300px] border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.636060487007!2d105.83988507599723!3d21.007221388517225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac76ccab6dd7%3A0x55e92a5b07a97d03!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1709480000000!5m2!1svi!2s" 
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