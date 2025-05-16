"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
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

const OtpVerification = () => {
    const router = useRouter();
  const [otpVerify, setOtpVerify] = useState("");
  const [mobile, setMobile] = useState<string | null>(null);

  useEffect(() => {
    const storedMobile = localStorage.getItem("mobile");
    setMobile(storedMobile);
  }, []);

  const handleSubmit = async () => {
  if (!otpVerify) {
    alert("OTP required!");
    return;
  }

  const mobile = localStorage.getItem("mobile");
  if (!mobile) {
    alert("Mobile number missing, please login again.");
    return;
  }

  const formData = new FormData();
  formData.append("otp", otpVerify);
  formData.append("mobile", mobile);

 try {
  const res = await AxiosInstance.post("/auth/verify-otp", formData);
  console.log("Uploaded:", res.data);

  if (res.data.success === true) {
  
    localStorage.setItem("access_token", res.data.access_token);

    alert("OTP verified successfully!");

    if (res.data.login === true) {
      
      router.push("/instructionPage"); 
    } else {
   
      router.push("/detailesAdd");
    }
  } else {
    alert(res.data.message || "Verification failed!");
  }
} catch (err: any) {
  console.error("Error uploading:", err);
  alert(err.response?.data?.message || "Verification failed!");
}

};


  return (
    <div className="min-h-screen w-full bg-[url('/image/banner.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="bg-slate-700 bg-opacity-90 w-full max-w-2xl rounded-xl shadow-xl p-2 flex flex-col md:flex-row items-center justify-between gap-10 ">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-14 w-full md:w-1/2 mt-12 md:-mt-10 pl-0 md:pl-6">
          <div className="flex items-center space-x-3">
            <Image
              src="/image/logo.png"
              alt="logo image"
              width={88}
              height={83}
            />
            <div>
              <h1
                className={`${poppins.className} text-xl font-bold text-white`}
              >
                NexLearn
              </h1>
              <h2
                className={`${poppins.className} text-xs text-white font-semibold`}
              >
                Futuristic learning
              </h2>
            </div>
          </div>

          <Image
            src="/image/side_image.png"
            alt="side image"
            width={335}
            height={260}
            className="object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-4 min-h-[380px] flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-1">
              Enter the code we texted you
            </h1>
            <p className={`${inter.className} text-xs text-gray-700 mt-8`}>
              We’ve sent an SMS to {mobile ? mobile : "your mobile number"}
            </p>

            <div className="relative w-full mt-4">
              <label className="absolute -top-2 left-3 bg-white text-xs text-gray-500 px-1">
                SMS code
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-1 focus-within:ring-black">
                <input
                  type="text"
                  placeholder="123 456"
                  className="w-full outline-none pl-2"
                  value={otpVerify}
                  onChange={(e) => setOtpVerify(e.target.value)}
                />
              </div>

              <p className={`${inter.className} text-xs text-gray-600 mt-8`}>
                Your 6 digit code is on its way. This can sometimes take a few
                moments to arrive.
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

export default OtpVerification;
