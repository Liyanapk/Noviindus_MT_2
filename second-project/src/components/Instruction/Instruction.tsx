"use client";
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Inter } from "next/font/google";
import Instructionapi from "@/utiles/instructionapi";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const Instruction = () => {
  const router = useRouter();
  const [Instructions, setInstructions] = useState<string>("");
  const [statsData, setStatsData] = useState({
    totalMCQs: 0,
    totalMarks: 0,
    totalTime: 0,
  });
  useEffect(() => {
    const fetchInstructions = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const data = await Instructionapi();
          setInstructions(data.instruction);
          setStatsData({
            totalMCQs: data.questions_count || 0,
            totalMarks: data.total_marks || 0,
            totalTime: data.total_time || 0,
          });
        } catch (error) {
          console.log("Error Fetching The Data", error);
        }
      }
    };
    fetchInstructions();
  }, []);

  const instructionList = Instructions
    ? Instructions.replace(/<\/?ol>/g, "")
        .split("</li>")
        .map((item) => item.replace(/<li>/, "").trim())
        .filter(Boolean)
    : [];

  const stats = [
    { title: "Total MCQ’s:", value: statsData.totalMCQs },
    { title: "Total marks:", value: statsData.totalMarks },
    { title: "Total time:", value: statsData.totalTime },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-7 mt-8 px-4 sm:px-6 lg:px-0">
        <h1
          className={`${inter.className} font-medium text-xl sm:text-2xl md:text-[26px] leading-[144%] tracking-[0%] text-center justify-center`}
        >
          Ancient Indian History MCQ
        </h1>

        <div className="w-full max-w-[700px] h-auto rounded-[7.91px] px-4 sm:px-6 py-6 bg-sky-950 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white text-white justify-center">
          {stats.map(({ title, value }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center py-4 sm:py-0 sm:px-6"
            >
              <h1
                className={`${inter.className} font-semibold text-base sm:text-[15.82px] leading-[144%] tracking-[0%]`}
              >
                {title}
              </h1>
              <p
                className={`${inter.className} font-normal text-3xl sm:text-[42.19px] leading-[144%] tracking-[0%]`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[700px] text-slate-600 flex flex-col mx-auto px-4 sm:px-6 py-4">
          <div
            className={`${inter.className} font-semibold text-sm sm:text-base leading-[154%] tracking-[0px] text-left`}
          >
            <h1 className="mb-2">Instructions:</h1>
            <ol className="list-decimal pl-5 space-y-1">
              {instructionList.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        <button
          className={`${inter.className} mt-6 mb-4 w-full max-w-[300px] px-6 py-4 bg-sky-950 text-white rounded-lg hover:bg-slate-700 font-semibold text-base sm:text-sm`}
          onClick={() => router.push("/questionPage")}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default Instruction;
