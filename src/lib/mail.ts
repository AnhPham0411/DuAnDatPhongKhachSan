import nodemailer from "nodemailer";

// Khởi tạo Transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const colors = {
  primary: "#0ea5e9", // Sky 500
  secondary: "#0f172a", // Slate 900
  background: "#f8fafc", // Slate 50
  white: "#ffffff",
  text: "#334155" // Slate 700
};

/**
 * 1. Mail chào mừng thành viên mới
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="background-color: ${colors.background}; padding: 40px 0; font-family: sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: ${colors.secondary}; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Ha Long Stay</h1>
        </div>
        <div style="padding: 40px 30px; line-height: 1.6; color: ${colors.text}; text-align: center;">
          <h2 style="color: ${colors.secondary};">Chào ${name}! 👋</h2>
          <p>Chào mừng bạn đến với hệ thống nghỉ dưỡng của chúng tôi. Tài khoản của bạn đã sẵn sàng!</p>
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: ${colors.primary}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Bắt đầu ngay</a>
          </div>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ha Long Stay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Chào mừng bạn đến với Ha Long Stay! 🌊",
    html,
  });
};

/**
 * 2. Mail xác nhận khi khách vừa đặt phòng xong
 */
export const sendBookingConfirmationEmail = async (
  email: string,
  bookingDetails: {
    roomName: string,
    checkIn: string,
    checkOut: string,
    totalPrice: string
  }
) => {
  const html = `
    <div style="background-color: ${colors.background}; padding: 40px 0; font-family: sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: ${colors.primary}; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Đơn Đặt Phòng Mới</h1>
        </div>
        <div style="padding: 40px 30px; color: ${colors.text};">
          <p>Chào bạn, yêu cầu đặt phòng của bạn đã được ghi nhận thành công.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b;">Phòng:</td><td style="padding: 8px 0; text-align: right; font-weight: bold;">${bookingDetails.roomName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Nhận phòng:</td><td style="padding: 8px 0; text-align: right;">${bookingDetails.checkIn}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Trả phòng:</td><td style="padding: 8px 0; text-align: right;">${bookingDetails.checkOut}</td></tr>
              <tr><td style="padding: 15px 0 0 0; font-weight: bold; border-top: 1px solid #e2e8f0;">Tổng tiền:</td><td style="padding: 15px 0 0 0; text-align: right; color: ${colors.primary}; font-weight: bold; font-size: 18px;">${bookingDetails.totalPrice}</td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ha Long Stay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Xác nhận đặt phòng thành công - ${bookingDetails.roomName} ✅`,
    html,
  });
};

/**
 * 3. Mail thông báo cập nhật trạng thái (Admin thay đổi)
 */
export const sendBookingStatusUpdateEmail = async (
  email: string,
  bookingId: string,
  newStatus: string
) => {
  const statusMap: Record<string, string> = {
    "PENDING": "Chờ xác nhận",
    "CONFIRMED": "Đã xác nhận",
    "CANCELLED": "Đã hủy đơn",
    "COMPLETED": "Hoàn thành",
    "PAID": "Đã thanh toán"
  };

  const statusText = statusMap[newStatus] || newStatus;

  const html = `
    <div style="background-color: ${colors.background}; padding: 40px 0; font-family: sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: ${colors.secondary}; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cập Nhật Đơn Hàng</h1>
        </div>
        <div style="padding: 40px 30px; color: ${colors.text}; text-align: center;">
          <p>Thông báo về đơn đặt phòng mã <b>#${bookingId.slice(-6).toUpperCase()}</b>.</p>
          <div style="margin: 30px 0; padding: 25px; background-color: #f1f5f9; border-radius: 12px; border: 1px dashed ${colors.primary};">
            <span style="display: block; color: #64748b; font-size: 14px; text-transform: uppercase;">Trạng thái mới:</span>
            <span style="display: block; font-size: 26px; font-weight: bold; color: ${colors.primary}; margin-top: 10px;">
              ${statusText}
            </span>
          </div>
          <p>Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ của Ha Long Stay.</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ha Long Stay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Cập nhật đơn hàng #${bookingId.slice(-6).toUpperCase()} - Ha Long Stay`,
    html,
  });
};