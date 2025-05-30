import Sidebar from "@/components/Sidebar";
import AppHeader from "@/components/HeaderApp";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <AppHeader />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
