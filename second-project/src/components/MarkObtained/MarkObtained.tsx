"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Inter } from "next/font/google";
import Image from "next/image";

interface ResultType {
  correct: number;
  wrong: number;
  not_attended: number;
  score: number;
  exam_history_id: string | number;
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "400"],
});

const MarkObtained = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<ResultType | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    const correctParam = searchParams.get("correct");
    const wrongParam = searchParams.get("wrong");
    const notAttendedParam = searchParams.get("not_attended");
    const scoreParam = searchParams.get("score");
    const examHistoryIdParam = searchParams.get("exam_history_id");

    if (
      correctParam !== null &&
      wrongParam !== null &&
      notAttendedParam !== null &&
      scoreParam !== null &&
      examHistoryIdParam !== null
    ) {
      setResult({
        correct: Number(correctParam),
        wrong: Number(wrongParam),
        not_attended: Number(notAttendedParam),
        score: Number(scoreParam),
        exam_history_id: examHistoryIdParam,
      });
    }
  }, [searchParams]);

  if (!result) return <div>Loading results...</div>;

  const totalQuestion = result.correct + result.wrong + result.not_attended;

  return (
    <div>
      <Navbar />
      <div
        className={`${inter.className} font-medium flex flex-col justify-center items-center mt-10 gap-6 p-8`}
      >
        <div className="space-y-4 w-full max-w-md">
          <div
            className=" p-6 rounded-md text-white"
            style={{
              background:
                "linear-gradient(307.95deg, #1C3141 2.54%, #177A9C 79.7%)",
            }}
          >
            <div className="flex flex-col justify-center items-center gap-1">
              <h1 className="text-sm font-normal">Marks Obtained:</h1>
              <h1 className="text-5xl font-semibold">
                {result.score} / {totalQuestion}
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-gray-800 w-full">
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/image/total_question.png"
                  alt=""
                  width={20}
                  height={20}
                />
                <h2>Total Questions:</h2>
              </div>
              <h2>{totalQuestion}</h2>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/image/correct_answer.png"
                  alt=""
                  width={20}
                  height={20}
                />
                <h2>Correct Answers:</h2>
              </div>
              <h2>{result.correct}</h2>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/image/wrong_answer.png"
                  alt=""
                  width={20}
                  height={20}
                />
                <h2>Incorrect Answers:</h2>
              </div>
              <h2>{result.wrong}</h2>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/image/not_attended.png"
                  alt=""
                  width={20}
                  height={20}
                />
                <h2>Not Attended Questions:</h2>
              </div>
              <h2>{result.not_attended}</h2>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <button
            className="bg-gray-800 w-full py-2 text-white font-medium text-sm rounded-md mt-4"
            onClick={() => router.push("/instructionPage")}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkObtained;
