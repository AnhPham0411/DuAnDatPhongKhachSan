// src/app/(admin)/admin/page.tsx
import { auth } from "@/auth"; // Import hàm auth để lấy session trên server
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // 1. Lấy thông tin người dùng hiện tại
  const session = await auth();

  // 2. Nếu chưa đăng nhập -> Đá về trang login
  if (!session?.user) {
    return redirect("/login");
  }

  // 3. Nếu đăng nhập rồi mà không phải ADMIN -> Đá về trang chủ
  if (session.user.role !== "ADMIN") {
    // Đây chính là lý do bạn bị redirect lúc nãy
    return redirect("/"); 
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Xin chào, <span className="font-bold text-blue-600">{session.user.name}</span></p>
        <p className="text-gray-500">Email: {session.user.email}</p>
        <p className="text-green-600 font-bold mt-2">Role: {session.user.role}</p>
      </div>
    </div>
  );
}