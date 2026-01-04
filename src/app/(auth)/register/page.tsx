// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. Logic chuẩn: Dùng Email và Password
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Gọi NextAuth: Key gửi đi là 'email'
      const result = await signIn("credentials", {
        email: email,    // <--- QUAN TRỌNG: Khớp với auth.ts
        password: password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Sai tài khoản hoặc mật khẩu!");
        console.error("Lỗi đăng nhập:", result.error);
      } else {
        toast.success("Đăng nhập thành công!");
        router.push("/"); 
        router.refresh(); 
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. LƯU Ý: Đã bỏ thẻ div bao ngoài (flex min-h...) vì (auth)/layout.tsx đã lo việc căn giữa.
    // Chỉ giữ lại cái hộp (Card) trắng ở giữa thôi.
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">
        Đăng nhập hệ thống
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-70 transition-colors"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}