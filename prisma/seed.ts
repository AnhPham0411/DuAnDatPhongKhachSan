// prisma/seed.ts
import { PrismaClient, UserRole, BookingStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')

  // =========================================================================
  // 1. DỌN DẸP DỮ LIỆU CŨ (Thứ tự quan trọng để tránh lỗi khóa ngoại)
  // =========================================================================
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.seasonalPrice.deleteMany()
  await prisma.roomImage.deleteMany()
  await prisma.room.deleteMany()
  await prisma.roomType.deleteMany()
  await prisma.account.deleteMany() // Xóa bảng Account
  await prisma.user.deleteMany()
  await prisma.amenity.deleteMany()

  console.log('🗑️  Đã dọn dẹp sạch sẽ database cũ.')

  // =========================================================================
  // 2. TẠO USER & ACCOUNT
  // =========================================================================
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 2.1 Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hotel.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      phone: '0901234567',
      image: 'https://avatar.iran.liara.run/public/job/police/male',
      emailVerified: new Date(),
    },
  })

  // 2.2 Staff
  const staff = await prisma.user.create({
    data: {
      email: 'staff@hotel.com',
      name: 'Lễ Tân Vui Vẻ',
      password: hashedPassword,
      role: UserRole.STAFF,
      phone: '0908888888',
      image: 'https://avatar.iran.liara.run/public/job/operator/female',
      emailVerified: new Date(),
    },
  })

  // 2.3 User 1 (Khách hàng thường xuyên)
  const user1 = await prisma.user.create({
    data: {
      email: 'khachhang1@gmail.com',
      name: 'Nguyễn Văn A',
      password: hashedPassword,
      role: UserRole.USER,
      phone: '0909000111',
      image: 'https://avatar.iran.liara.run/public/boy',
      emailVerified: new Date(),
    },
  })

  // 2.4 User 2 (Khách hàng vãng lai)
  const user2 = await prisma.user.create({
    data: {
      email: 'khachhang2@gmail.com',
      name: 'Trần Thị B',
      password: hashedPassword,
      role: UserRole.USER,
      phone: '0909000222',
      image: 'https://avatar.iran.liara.run/public/girl',
    },
  })

  // 2.5 Tạo Account giả (Giả lập user1 đã từng login bằng Google)
  await prisma.account.create({
    data: {
      userId: user1.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: '1234567890_mock_google_id',
      access_token: 'mock_access_token',
      token_type: 'Bearer',
      scope: 'email profile',
    }
  })

  console.log('✅ Đã tạo Users & Accounts')

  // =========================================================================
  // 3. TẠO TIỆN NGHI (AMENITIES)
  // =========================================================================
  const amenityList = [
    { name: 'Wifi tốc độ cao', icon: 'wifi' },
    { name: 'Điều hòa 2 chiều', icon: 'wind' },
    { name: 'Smart TV 4K', icon: 'tv' },
    { name: 'Hồ bơi vô cực', icon: 'waves' },
    { name: 'Bữa sáng miễn phí', icon: 'coffee' },
    { name: 'Bồn tắm nằm', icon: 'bath' },
    { name: 'Phòng Gym', icon: 'dumbbell' },
    { name: 'Quầy Bar Mini', icon: 'wine' },
    { name: 'Ban công ngắm biển', icon: 'sun' },
    { name: 'Két sắt an toàn', icon: 'lock' },
  ]

  // Lưu lại các object amenity đã tạo để dùng sau
  const savedAmenities: any[] = []
  for (const item of amenityList) {
    const am = await prisma.amenity.create({ data: item })
    savedAmenities.push(am)
  }
  console.log('✅ Đã tạo Amenities')

  // =========================================================================
  // 4. TẠO LOẠI PHÒNG (ROOM TYPES)
  // =========================================================================
  
  // Helper lấy ID tiện nghi ngẫu nhiên
  const getRandAm = () => savedAmenities.slice(0, Math.floor(Math.random() * 5) + 3).map(a => ({ id: a.id }))

  // 4.1 Standard
  const standardType = await prisma.roomType.create({
    data: {
      name: 'Standard Room',
      description: 'Phòng tiêu chuẩn ấm cúng, đầy đủ tiện nghi cơ bản, giá cả hợp lý.',
      basePrice: 500000,
      capacity: 2,
      amenities: { connect: [savedAmenities[0], savedAmenities[1], savedAmenities[2]] }, // Wifi, AC, TV
    },
  })

  // 4.2 Deluxe
  const deluxeType = await prisma.roomType.create({
    data: {
      name: 'Deluxe Ocean View',
      description: 'Phòng hướng biển tuyệt đẹp, ban công rộng rãi đón gió.',
      basePrice: 1500000,
      capacity: 2,
      amenities: { connect: [savedAmenities[0], savedAmenities[1], savedAmenities[2], savedAmenities[4], savedAmenities[5], savedAmenities[8]] },
    },
  })

  // 4.3 Family Suite
  const familyType = await prisma.roomType.create({
    data: {
      name: 'Family Suite',
      description: 'Căn hộ rộng rãi cho gia đình 4 người, có bếp nhỏ và phòng khách.',
      basePrice: 2800000,
      capacity: 4,
      amenities: { connect: savedAmenities.map(a => ({ id: a.id })) }, // Full tiện nghi
    },
  })

  console.log('✅ Đã tạo RoomTypes')

  // =========================================================================
  // 5. TẠO PHÒNG (ROOMS), ẢNH & GIÁ MÙA VỤ
  // =========================================================================

  // Hàm tạo phòng
  const createRoomsForType = async (type: any, prefix: string, count: number, images: string[]) => {
    for (let i = 1; i <= count; i++) {
      const roomNum = `${prefix}0${i}`
      const room = await prisma.room.create({
        data: {
          name: roomNum,
          roomTypeId: type.id,
          isAvailable: i !== count, // Phòng cuối cùng để trạng thái đang bảo trì (false)
          images: {
            create: images.map((url, idx) => ({
              url: url,
              altText: `${type.name} - View ${idx + 1}`
            }))
          }
        }
      })

      // Thêm giá mùa vụ cho phòng số 01 của mỗi loại
      if (i === 1) {
        await prisma.seasonalPrice.create({
          data: {
            roomId: room.id,
            startDate: new Date('2024-12-20'), // Mùa giáng sinh
            endDate: new Date('2025-01-05'),
            price: Number(type.basePrice) * 1.5, // Tăng giá 50%
          }
        })
      }
    }
  }

  // Tạo 5 phòng Standard
  await createRoomsForType(standardType, '1', 5, [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800'
  ])

  // Tạo 5 phòng Deluxe
  await createRoomsForType(deluxeType, '2', 5, [
    'https://images.unsplash.com/photo-1590490360182-f33fb0d41388?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800'
  ])

  // Tạo 3 phòng Family
  await createRoomsForType(familyType, '3', 3, [
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1631049307204-676015f846fe?auto=format&fit=crop&w=800'
  ])

  console.log('✅ Đã tạo Rooms, Images & SeasonalPrices')

  // =========================================================================
  // 6. TẠO BOOKING, PAYMENT & REVIEW (QUAN TRỌNG: TEST LOGIC)
  // =========================================================================
  
  // Lấy ra phòng để đặt
  const roomStandard = await prisma.room.findFirst({ where: { roomTypeId: standardType.id } })
  const roomDeluxe = await prisma.room.findFirst({ where: { roomTypeId: deluxeType.id } })

  if (!roomStandard || !roomDeluxe) return

  // CASE 1: Đơn hàng ĐÃ HOÀN THÀNH (Quá khứ) -> Có Review
  const pastBooking = await prisma.booking.create({
    data: {
      userId: user1.id,
      roomId: roomStandard.id,
      checkIn: new Date('2023-12-01'),
      checkOut: new Date('2023-12-05'),
      totalPrice: 2000000,
      status: BookingStatus.CHECKED_OUT,
      paymentStatus: PaymentStatus.PAID,
      guestName: user1.name,
      guestEmail: user1.email,
      guestPhone: user1.phone,
      payment: {
        create: {
          amount: 2000000,
          provider: 'MOMO',
          transactionCode: 'MOMO_TRANS_001',
          status: PaymentStatus.PAID
        }
      },
      review: {
        create: {
          userId: user1.id,
          rating: 5,
          comment: 'Phòng rất sạch sẽ, nhân viên thân thiện. Sẽ quay lại!'
        }
      }
    }
  })

  // CASE 2: Đơn hàng ĐANG Ở (Hiện tại)
  const currentBooking = await prisma.booking.create({
    data: {
      userId: user2.id,
      roomId: roomDeluxe.id,
      checkIn: new Date(), // Hôm nay
      checkOut: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 ngày nữa
      totalPrice: 4500000,
      status: BookingStatus.CHECKED_IN,
      paymentStatus: PaymentStatus.PAID,
      guestName: 'Phạm Văn C', // Đặt hộ người khác
      guestEmail: 'phamvanc@gmail.com',
      guestPhone: '0912345678',
      payment: {
        create: {
          amount: 4500000,
          provider: 'VNPAY',
          transactionCode: 'VNPAY_TRANS_002',
          status: PaymentStatus.PAID
        }
      }
    }
  })

  // CASE 3: Đơn hàng TƯƠNG LAI (Sắp tới)
  const futureBooking = await prisma.booking.create({
    data: {
      userId: user1.id,
      roomId: roomDeluxe.id,
      checkIn: new Date('2025-02-10'),
      checkOut: new Date('2025-02-14'),
      totalPrice: 6000000,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      guestName: user1.name,
      guestEmail: user1.email,
      guestPhone: user1.phone,
      note: 'Chuẩn bị giúp tôi một ít hoa hồng vì là kỷ niệm ngày cưới.',
      payment: {
        create: {
          amount: 6000000,
          provider: 'CASH',
          status: PaymentStatus.PAID // Đã cọc tiền mặt
        }
      }
    }
  })

  // CASE 4: Đơn hàng ĐÃ HỦY
  const cancelledBooking = await prisma.booking.create({
    data: {
      userId: user2.id,
      roomId: roomStandard.id,
      checkIn: new Date('2024-01-01'),
      checkOut: new Date('2024-01-02'),
      totalPrice: 500000,
      status: BookingStatus.CANCELLED,
      paymentStatus: PaymentStatus.REFUNDED,
      guestName: user2.name,
      guestEmail: user2.email,
      guestPhone: user2.phone,
      payment: {
        create: {
          amount: 500000,
          provider: 'MOMO',
          transactionCode: 'MOMO_TRANS_003',
          status: PaymentStatus.REFUNDED
        }
      }
    }
  })

  console.log('✅ Đã tạo Bookings, Payments & Reviews')
  console.log('🏁 SEEDING HOÀN TẤT! Sẵn sàng sử dụng.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })