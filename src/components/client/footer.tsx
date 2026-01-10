"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Cột 1: Thông tin chung */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">MyHotel</h3>
            <p className="text-sm text-slate-500">
              Trải nghiệm nghỉ dưỡng đẳng cấp với hệ thống phòng tiện nghi và dịch vụ chuyên nghiệp.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Khám phá
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/search" className="hover:text-primary hover:underline">
                  Tìm phòng
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary hover:underline">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary hover:underline">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Chính sách
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/terms" className="hover:text-primary hover:underline">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary hover:underline">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary hover:underline">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Kết nối
            </h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-primary transition">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-primary transition">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-primary transition">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MyHotel Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};