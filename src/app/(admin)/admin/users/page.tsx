export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h2>
      </div>
      <div className="h-px bg-slate-200 my-4" />
      
      <div className="rounded-md border p-8 text-center bg-white">
        <p>Danh sách người dùng đã đăng ký sẽ hiện ở đây.</p>
      </div>
    </div>
  );
}