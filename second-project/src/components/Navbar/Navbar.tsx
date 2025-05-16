"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/utiles/axiosInstance";
import { useState } from "react";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("/auth/logout");
      if (response.data.success) {
        localStorage.removeItem("access_token");
        router.push("/");
      } else {
        alert(response.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <nav className="relative border border-gray-200 bg-white p-2 w-full md:w-full">
        <button
          className={`absolute top-4 right-4 px-3 sm:px-4 py-1.5 sm:py-2 ${inter.className} bg-[#0c708c] text-white font-medium text-xs sm:text-sm rounded-md hover:bg-[#0B3A4B] transition`}
          onClick={() => setShowLogoutConfirm(true)}
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

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 ml-2 mr-2 max-w-sm w-full text-center">
            <h2 id="logout-dialog-title" className="text-lg font-semibold mb-4">
              Do you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-[#0c708c] hover:bg-[#0b5a6a] text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
