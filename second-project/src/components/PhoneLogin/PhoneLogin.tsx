"use client";
import { useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import AxiosInstance from "@/utiles/axiosInstance";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const PhoneLogin = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const handleSubmit = async () => {
    if (!phoneNumber) {
      alert("Phone number is required");
      return;
    }

    const formData = new FormData();
    formData.append("mobile", `${countryCode}${phoneNumber}`);

    try {
      const res = await AxiosInstance.post("/auth/send-otp", formData);

      if (res.data.success === true) {
        localStorage.setItem("mobile", `${countryCode}${phoneNumber}`);
        alert("Logged in successfully!");
        router.push("/verifyOtp");
      } else {
        alert("Error in logging in");
      }
    } catch (err) {
      alert("Request failed!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/image/banner.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="bg-slate-700 bg-opacity-90 w-full max-w-2xl rounded-xl shadow-xl p-2 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-14 w-full md:w-1/2 mt-12 md:-mt-10 pl-0 md:pl-6">
          <div className="flex items-center space-x-3">
            <Image src="/image/logo.png" alt="logo image" width={88} height={83} />
            <div>
              <h1 className={`${poppins.className} text-xl font-bold text-white`}>NexLearn</h1>
              <h2 className={`${poppins.className} text-xs text-white font-semibold`}>Futuristic learning</h2>
            </div>
          </div>
          <Image src="/image/side_image.png" alt="side image" width={335} height={260} className="object-contain" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-4 min-h-[380px] flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-1">Enter Phone Number</h1>
            <p className={`${inter.className} text-xs text-gray-700 mt-4`}>
              We use your mobile number to identify your account
            </p>
            <div className="relative w-full mt-4">
              <label className="absolute -top-2 left-3 bg-white text-xs text-gray-500 px-1">Phone Number</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-1 focus-within:ring-black">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="outline-none bg-transparent text-gray-700 pr-2"
                >
                  <option value="+91">+91</option>
                </select>
                <input
                  type="text"
                  placeholder="1234567890"
                  className="w-full outline-none pl-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <p className={`${inter.className} text-xs text-gray-600 mt-6`}>
                By tapping Get started, you agree to the Terms & Conditions
              </p>
            </div>
          </div>
          <button
            className={`${inter.className} mt-6 w-full px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-semibold`}
            onClick={handleSubmit}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
