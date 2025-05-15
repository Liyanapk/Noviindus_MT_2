'use client'
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/utiles/axiosInstance";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
});

const Navbar = () => {

    const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post('/auth/logout');
      if (response.data.success) {
        localStorage.removeItem('access_token');
        router.push('/');  
      } else {
        alert(response.data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out');
    }
  };

  return (
    <nav className="relative border border-gray-200 bg-white p-2 w-full md:w-full">
      <button
        className={`absolute top-4 right-4 px-3 sm:px-4 py-1.5 sm:py-2 ${inter.className} bg-[#0c708c] text-white font-medium text-xs sm:text-sm rounded-md hover:bg-[#0B3A4B] transition`}
      onClick={handleLogout}
      >
        Logout
      </button>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-center items-center gap-3 sm:gap-6">
        <Image
          src="/image/navbar_logo.png"
          alt="Navbar logo"
          width={48}
          height={44}
          className="sm:w-16 sm:h-16"
          priority
        />
        <div className="flex flex-col items-center sm:items-start mt-1 sm:mt-2">
          <h1
            className={`${poppins.className} text-transparent bg-clip-text bg-[linear-gradient(90deg,_#0A93BA_0%,_#0B3A4B_100%)] font-semibold text-lg sm:text-[25.1px] leading-tight tracking-normal`}
          >
            NexLearn
          </h1>
          <p
            className={`${poppins.className} font-medium text-[8px] sm:text-[9.45px] leading-tight tracking-normal text-transparent bg-clip-text bg-[linear-gradient(90deg,_#0A93BA_0%,_#0B3A4B_100%)]`}
          >
            futuristic learning
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
