import { Header } from "@/shared/components";
import Sidebar from "@/shared/components/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
    >
      <Header />
      
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1">
          {children}
        </main>
      </div>
      
    </div>
  );
}