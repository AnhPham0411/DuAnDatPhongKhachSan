"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
// --- AMENITY ACTIONS ---
export async function createAmenity(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await db.amenity.create({ data: { name } });
  revalidatePath("/admin/amenities"); // Làm mới trang ngay lập tức
}

export async function deleteAmenity(id: string) {
  await db.amenity.delete({ where: { id } });
  revalidatePath("/admin/amenities");
}

// --- CATEGORY ACTIONS ---
export async function createRoomType(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = Number(formData.get("basePrice"));
  const capacity = Number(formData.get("capacity"));

  await db.roomType.create({
    data: { name, description, basePrice, capacity }
  });
  revalidatePath("/admin/categories");
}

// --- ROOM TYPE (CATEGORIES) ---
// Hàm xóa loại phòng
export async function deleteRoomType(id: string) {
  try {
    await db.roomType.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Không thể xóa (Có thể đang có phòng thuộc loại này)" };
  }
}

// --- BOOKING ACTIONS ---
// Hàm đổi trạng thái đơn (Duyệt, Check-in, Hủy...)
export async function updateBookingStatus(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const status = formData.get("status") as BookingStatus;

  if (!bookingId || !status) return;

  await db.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar"); // Cập nhật cả lịch
}