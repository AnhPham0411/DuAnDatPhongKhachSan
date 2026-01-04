import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative flex">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 flex-1 h-full bg-slate-100 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}