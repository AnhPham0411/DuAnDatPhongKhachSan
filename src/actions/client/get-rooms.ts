"use server";

import { db } from "@/lib/db";
import { SafeRoom } from "@/types";
import { auth } from "@/lib/auth";

interface GetRoomsParams {
  category?: string;
  guests?: number;
  startDate?: string;
  endDate?: string;
  sort?: string; // 👈 1. Thêm tham số sort vào interface
}

// =============================================================================
// 1. LẤY DANH SÁCH PHÒNG (Trang chủ & Tìm kiếm)
// =============================================================================
export const getRooms = async ({
  category,
  guests,
  startDate,
  endDate,
  sort, // 👈 2. Nhận tham số sort
}: GetRoomsParams): Promise<SafeRoom[]> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // --- XÂY DỰNG ĐIỀU KIỆN LỌC (WHERE) ---
    const where: any = {
      isAvailable: true,
    };

    if (category) {
      where.roomType = { name: { contains: category } }; // Tìm theo tên loại phòng (hoặc bạn có thể sửa thành categoryId nếu muốn chính xác)
    }

    if (guests) {
      // Logic cũ: where.roomType = { ...where.roomType, capacity: { gte: guests } };
      // Cách viết an toàn hơn để tránh ghi đè object roomType:
      where.roomType = {
        ...where.roomType,
        capacity: { gte: guests },
      };
    }

    // Lọc theo ngày trống (Nếu user chọn ngày)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Tìm những phòng KHÔNG CÓ booking nào trùng vào khoảng ngày này
      where.bookings = {
        none: {
          OR: [
            { checkIn: { lte: start }, checkOut: { gte: start } }, // Booking bao trùm ngày bắt đầu
            { checkIn: { lte: end }, checkOut: { gte: end } },     // Booking bao trùm ngày kết thúc
            { checkIn: { gte: start }, checkOut: { lte: end } },   // Booking nằm gọn bên trong
          ],
          // Chỉ xét các đơn đã xác nhận hoặc đã thanh toán (tránh đơn hủy)
          status: { in: ["CONFIRMED", "PAID", "COMPLETED"] } 
        },
      };
    }

    // --- XÂY DỰNG ĐIỀU KIỆN SẮP XẾP (ORDER BY) ---
    // 👈 3. Xử lý logic sort
    let orderBy: any = { createdAt: "desc" }; // Mặc định: Mới nhất

    if (sort === "price_asc") {
      orderBy = { roomType: { basePrice: "asc" } };
    } else if (sort === "price_desc") {
      orderBy = { roomType: { basePrice: "desc" } };
    } else if (sort === "rating_desc") {
       // Sắp xếp theo đánh giá hơi phức tạp với Prisma thuần, 
       // tạm thời để mặc định hoặc cần raw query. 
       // Ở đây ta cứ fallback về mới nhất nếu chưa implement sort rating.
       orderBy = { createdAt: "desc" };
    }

    // --- TRUY VẤN DATABASE ---
    const rawRooms = await db.room.findMany({
      where,
      include: {
        images: true,
        roomType: {
          include: {
            amenities: true,
            location: true,
          },
        },
        bookings: {
          where: { review: { isNot: null } },
          select: { review: { select: { rating: true } } },
        },
        wishlists: userId ? { where: { userId } } : false,
      },
      orderBy: orderBy, // 👈 4. Áp dụng sort vào query
    });

    // --- TRANSFORM DỮ LIỆU ---
    return rawRooms.map((room) => {
      const reviews = room.bookings.map((b) => b.review).filter((r) => r !== null);
      
      // Tính điểm trung bình (nếu cần sort rating phía client)
      // const avgRating = reviews.length > 0 
      //   ? reviews.reduce((a, b) => a + b!.rating, 0) / reviews.length 
      //   : 0;

      const { bookings, wishlists, ...rest } = room;

      return {
        ...rest,
        createdAt: room.createdAt.toISOString(),
        roomType: {
          ...room.roomType,
          basePrice: room.roomType.basePrice.toNumber(),
        },
        reviews: reviews,
        isLiked: wishlists && wishlists.length > 0,
      };
    });
  } catch (error) {
    console.error("GET_ROOMS_ERROR", error);
    return [];
  }
};

// =============================================================================
// 2. LẤY CHI TIẾT 1 PHÒNG (Giữ nguyên không đổi)
// =============================================================================
export const getRoomById = async (roomId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const room = await db.room.findUnique({
      where: { id: roomId },
      include: {
        images: true,
        roomType: {
          include: {
            amenities: true,
            location: true,
            rooms: { 
                where: { isAvailable: true, id: { not: roomId } }, // Lấy các phòng khác cùng loại để gợi ý
                take: 4,
                select: { id: true } 
            },
          },
        },
        wishlists: userId ? { where: { userId } } : false,
      },
    });

    if (!room) return null;

    const reviews = await db.review.findMany({
      where: { booking: { roomId: roomId } },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    const { wishlists, ...rest } = room;

    return {
      ...rest,
      createdAt: room.createdAt.toISOString(),
      roomType: {
        ...room.roomType,
        basePrice: room.roomType.basePrice.toNumber(),
      },
      reviews: reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      isLiked: wishlists && wishlists.length > 0,
    };
  } catch (error) {
    console.error("GET_ROOM_BY_ID_ERROR", error);
    return null;
  }
};

// =============================================================================
// 3. LẤY NHIỀU PHÒNG THEO ID (Giữ nguyên không đổi)
// =============================================================================
export const getRoomsByIds = async (ids: string[]) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Chỉ tìm những ID hợp lệ (tránh lỗi nếu ids rỗng)
    if (!ids || ids.length === 0) return [];

    const rawRooms = await db.room.findMany({
      where: { id: { in: ids } },
      include: {
        roomType: {
          include: {
            amenities: true,
            location: true,
          }
        },
        images: true,
        bookings: {
          where: { review: { isNot: null } },
          select: { review: { include: { user: true } } }
        },
        wishlists: userId ? { where: { userId } } : false,
      }
    });

    return rawRooms.map((room) => {
      const reviews = room.bookings.map(b => b.review).filter(r => r !== null);
      const { bookings, wishlists, ...rest } = room;

      return {
        ...rest,
        createdAt: room.createdAt.toISOString(),
        roomType: {
          ...room.roomType,
          basePrice: room.roomType.basePrice.toNumber(),
        },
        reviews: reviews,
        isLiked: wishlists && wishlists.length > 0,
      };
    });

  } catch (error) {
    console.log("[GET_COMPARE_ROOMS]", error);
    return [];
  }
};