
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, LayoutList } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-12 max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Daily Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organisir hari Anda dengan efisien menggunakan planner waktu blok
          </p>
          
          <div className="grid gap-8 md:grid-cols-3 mb-10 px-6">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-blue-50 p-3 rounded-full w-fit mb-3">
                <LayoutList className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Buat To-Do List</h3>
              <p className="text-gray-600 text-sm">
                Tambahkan semua aktivitas yang ingin Anda lakukan hari ini
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-blue-50 p-3 rounded-full w-fit mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Jadwalkan Waktu</h3>
              <p className="text-gray-600 text-sm">
                Atur aktivitas Anda dalam blok waktu 15 menit
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="bg-blue-50 p-3 rounded-full w-fit mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pantau Kemajuan</h3>
              <p className="text-gray-600 text-sm">
                Lihat jadwal Anda untuk hari ini dan hari-hari berikutnya
              </p>
            </div>
          </div>
          
          <Link to="/planner">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Buka Daily Planner
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="text-center p-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Daily Planner - Aplikasi manajemen waktu yang efisien
      </footer>
    </div>
  );
};

export default Index;
