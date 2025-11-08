import DashboardNavbar from "./DashboardNavbar";




export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Shared Navbar */}
      <DashboardNavbar />

      {/* Main Dashboard Body */}
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
