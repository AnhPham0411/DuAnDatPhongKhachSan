// app/layout.tsx
import { SessionProvider } from "next-auth/react"; // 👈 1. Import cái này
import { Navbar } from "@/components/client/navbar";
import { Footer } from "@/components/client/footer";
import { Toaster } from "@/components/ui/sonner"; // Hoặc toaster bạn đang dùng
// import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {/* 👇 2. Bọc toàn bộ nội dung trong SessionProvider */}
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}