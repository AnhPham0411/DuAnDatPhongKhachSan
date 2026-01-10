"use server";

import { db } from "@/lib/db";
import { SafeRoom } from "@/types";
import { auth } from "@/lib/auth"; // <-- IMPORT AUTH

interface GetRoomsParams {
  category?: string;
  guests?: number;
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// 1. LẤY DANH SÁCH PHÒNG (Trang chủ & Tìm kiếm)
// =============================================================================
export const getRooms = async ({
  category,
  guests,
}: GetRoomsParams): Promise<SafeRoom[]> => {
  try {
    const session = await auth(); // Lấy user để check wishlist
    const userId = session?.user?.id;

    const where: any = {
      isAvailable: true,
    };

    if (category) where.roomType = { name: { contains: category } };
    if (guests) where.roomType = { ...where.roomType, capacity: { gte: guests } };

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
          select: { review: { select: { rating: true } } }
        },
        // 👇 CHECK WISHLIST
        wishlists: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: "desc" },
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
        isLiked: wishlists && wishlists.length > 0, // True nếu user đã like
      };
    });
  } catch (error) {
    console.error("GET_ROOMS_ERROR", error);
    return [];
  }
};

// =============================================================================
// 2. LẤY CHI TIẾT 1 PHÒNG (Trang Detail)
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
            rooms: { select: { id: true } },
          },
        },
        // 👇 CHECK WISHLIST
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
// 3. LẤY NHIỀU PHÒNG THEO ID (Trang So sánh)
// =============================================================================
export const getRoomsByIds = async (ids: string[]) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

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
        // 👇 CHECK WISHLIST
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