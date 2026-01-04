import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// IMPORT CÁI FILE BẠN VỪA TẠO Ở BƯỚC 1
import Providers from "@/components/Providers"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Booking App",
  description: "Graduation Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* Dùng cái Providers tự tạo bọc lấy toàn bộ nội dung */}
        <Providers>
            {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}