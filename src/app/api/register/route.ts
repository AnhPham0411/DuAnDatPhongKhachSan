import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Thư viện mã hóa
import { db } from "@/lib/db"; // File kết nối Prisma bạn đã có

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password || !name) {
      return new NextResponse("Thiếu thông tin", { status: 400 });
    }

    // 2. Kiểm tra xem email đã tồn tại chưa
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email này đã được sử dụng", { status: 409 });
    }

    // 3. MÃ HÓA MẬT KHẨU (Đây là bước bạn yêu cầu)
    // số 10 là salt rounds, càng cao càng an toàn nhưng chậm hơn
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user mới vào Database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
        role: "USER", // Mặc định là user thường
      },
    });

    // Trả về thành công (không trả về password)
    const { password: newUserPassword, ...rest } = user;
    
    return NextResponse.json(
      { user: rest, message: "Đăng ký thành công" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Lỗi hệ thống", { status: 500 });
  }
}