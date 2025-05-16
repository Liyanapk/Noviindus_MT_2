"use client";

import React, { useEffect, useState } from "react";
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

const AddDetailes = () => {
  const router = useRouter();
  const [mobile, setMobile] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    qualification: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name:
        formData.name.trim().length > 2
          ? ""
          : "Name must be at least 3 characters long.",
      email: formData.email ? "" : "Email is required.",
      qualification: formData.qualification ? "" : "Qualification is required.",
      image: imageFile ? "" : "Profile image is required.",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("mobile", mobile);
    data.append("email", formData.email);
    data.append("qualification", formData.qualification);
    data.append("profile_image", imageFile!);

    try {
      const res = await AxiosInstance.post("/auth/create-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success === true) {
        localStorage.setItem("access_token", res.data.access_token);

        alert("Form submitted successfully!");
        router.push("/instructionPage");
      } else {
        alert("Error in adding details");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to submit form.");
    }
  };

  useEffect(() => {
    const storedMobileData = localStorage.getItem("mobile");
    if (storedMobileData) {
      setMobile(storedMobileData);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[url('/image/banner.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="bg-slate-700 bg-opacity-90 w-full max-w-4xl rounded-xl shadow-xl p-2 flex flex-col md:flex-row items-center justify-between gap-10 ">
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

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-4 min-h-[380px] flex flex-col justify-between"
        >
          <h1 className={`${poppins.className} text-xl font-bold mb-1 mt-4`}>
            Add Your Details
          </h1>

          <div className="flex items-center justify-center mt-5">
            <label className="relative w-36 h-36 bg-white border-2 border-slate-300 border-dashed rounded-xl overflow-hidden cursor-pointer flex items-center justify-center">
              {imageFile ? (
                <>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-500 text-xs space-y-3">
                  <Image
                    src="/image/CameraPlus.png"
                    alt="camera image"
                    width={20}
                    height={20}
                  />
                  <span className="text-xs text-center space-y-2">
                    Add Your Profile Picture
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          {errors.image && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {errors.image}
            </p>
          )}

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 p-2 rounded-lg mt-4"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded-lg mt-4"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <input
            name="qualification"
            type="text"
            placeholder="Qualification"
            className="w-full border border-gray-300 p-2 rounded-lg mt-4"
            onChange={handleChange}
            value={formData.qualification}
          />
          {errors.qualification && (
            <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>
          )}

          <button
            className={`${inter.className} mt-6 w-full px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-semibold`}
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDetailes;
