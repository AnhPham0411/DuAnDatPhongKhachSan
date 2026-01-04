import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; 
import Providers from "@/components/Providers";

// 1. IMPORT HAI THÀNH PHẦN NÀY VÀO
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer"; // (Giả sử bạn đã có file Footer.tsx trong components)

const inter = Inter({ subsets: ["latin"] }); 

export const metadata: Metadata = {
  title: "Hotel Booking",
  description: "...",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          {/* Wrapper chính: Giúp Footer luôn ở đáy */}
          <div className="flex flex-col min-h-screen">
            
            {/* 2. HEADER: Luôn ở trên cùng */}
            <Navbar />
            
            {/* 3. NỘI DUNG CHÍNH: 
                - flex-1: Chiếm hết khoảng trống còn lại -> Đẩy Footer xuống đáy
                - pt-16: Cách lề trên 1 khoảng bằng chiều cao Navbar (để ko bị che)
            */}
            <main className="flex-1 pt-16 bg-gray-50">
                {children}
            </main>

            {/* 4. FOOTER: Luôn ở dưới cùng */}
            <Footer />
            
          </div>
        </Providers>
      </body>
    </html>
  );
}