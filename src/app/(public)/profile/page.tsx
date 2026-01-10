import { auth } from "@/lib/auth"; // 👈 Chỉ import auth, KHÔNG import authOptions
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// 👇 Đảm bảo bạn đã tạo component này, nếu chưa thì tạm thời comment lại để chạy test
import ProfileForm from "@/components/client/profile-form"; 

export default async function ProfilePage() {
  // 1. Dùng auth() thay vì getServerSession(authOptions)
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  // 2. Fetch dữ liệu mới nhất từ DB
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
        id: true,
        name: true,
        email: true,
        phone: true, // Đảm bảo schema prisma của bạn có trường này
        image: true,
        role: true,
    }
  });

  if (!user) return redirect("/login");

  // Logic hiển thị Avatar fallback (Lấy chữ cái đầu)
  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

      <div className="grid gap-6">
        {/* Card hiển thị thông tin cơ bản */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
               <AvatarImage src={user.image || ""} />
               <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                 {initial}
               </AvatarFallback>
            </Avatar>
            <div>
               <CardTitle className="text-xl">{user.name}</CardTitle>
               <CardDescription>{user.email}</CardDescription>
               <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md mt-2 inline-block capitalize">
                  {user.role.toLowerCase()}
               </span>
            </div>
          </CardHeader>
        </Card>

        {/* Form cập nhật */}
        <Card>
            <CardHeader>
                <CardTitle>Cập nhật thông tin</CardTitle>
                <CardDescription>Thay đổi tên hiển thị và số điện thoại liên hệ của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Truyền user prop vào form client */}
                <ProfileForm user={user} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}