export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#202124] text-white flex items-center justify-center px-4 relative overflow-hidden">

      <main className="relative z-10 w-full max-w-280">
        {children}
      </main>

      {/* <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Справка
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Конфиденциальность
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Условия
          </a>
        </div> */}
    </div>
  );
}