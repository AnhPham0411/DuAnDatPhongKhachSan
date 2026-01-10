import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminRootPage() {
  // 1. Lấy session
  const session = await auth();

  // 2. Chưa đăng nhập -> Về Login
  if (!session?.user) {
    return redirect("/login");
  }

  // 3. Không phải Admin -> Về trang chủ
  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  // 4. 👇 QUAN TRỌNG: Chuyển hướng ngay lập tức sang trang Dashboard thống kê
  return redirect("/admin/dashboard");
}