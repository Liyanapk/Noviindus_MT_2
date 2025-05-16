import Navbar from "../Navbar/Navbar";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "400"],
});

const marks = [
  { exam_history_id: 1, score: 1, correct: 4, wrong: 4, not_attended: 4 },
];

const MarkObtained = () => {
  return (
    <div>
      <Navbar />
     <div className={`${inter.className} font-medium flex flex-col justify-center items-center mt-10 gap-6 p-8`}>
  {marks.map((mark) => {
    const totalQuestion = mark.correct + mark.wrong + mark.not_attended;

    return (
      <div key={mark.exam_history_id} className="space-y-4 w-full max-w-md">
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
              {mark.score} / {totalQuestion}
            </h1>
          </div>
        </div>

        <div className="space-y-4 text-gray-800 w-full">
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Image src="/image/total_question.png" alt="" width={20} height={20} />
              <h2>Total Questions:</h2>
            </div>
            <h2>{totalQuestion}</h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image src="/image/correct_answer.png" alt="" width={20} height={20} />
              <h2>Correct Answers:</h2>
            </div>
            <h2>{mark.correct}</h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image src="/image/wrong_answer.png" alt="" width={20} height={20} />
              <h2>Incorrect Answers:</h2>
            </div>
            <h2>{mark.wrong}</h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image src="/image/not_attended.png" alt="" width={20} height={20} />
              <h2>Not Attended Questions:</h2>
            </div>
            <h2>{mark.not_attended}</h2>
          </div>
        </div>
      </div>
    );
  })}

  <div className="w-full max-w-md">
    <button className="bg-gray-800 w-full py-2 text-white font-medium text-sm rounded-md mt-4">
      Done
    </button>
  </div>
</div>

    </div>
  );
};

export default MarkObtained;
