"use client";
import Instructionapi from "@/utiles/instructionapi";
import Navbar from "../Navbar/Navbar";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import AxiosInstance from "@/utiles/axiosInstance";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "400"],
});

type Option = {
  id: number;
  option: string;
  is_correct: boolean;
  image: string | null;
};

type Question = {
  comprehension: string;
  question_id: number;
  question: string;
  image: string;
  options: Option[];
  number: number;
};

const Question = () => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComprehension, setShowComprehension] = useState(false);
  const [questionlist, setQuestion] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number;
  }>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const currentQuestion = questionlist[currentIndex];
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const handleOptionSelect = (optionId: number) => {
    const questionId = questionlist[currentIndex].question_id;
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowComprehension(false);
    }
  };

  const handleNext = () => {
    const currentQid = questionlist[currentIndex].question_id;
    const isAnswered = selectedOptions[currentQid];

    if (!isAnswered) {
      setUnansweredQuestions((prev) => [...new Set([...prev, currentQid])]);
    } else {
      setUnansweredQuestions((prev) => prev.filter((id) => id !== currentQid));
    }

    if (currentIndex < questionlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowComprehension(false);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const data = await Instructionapi();
          setQuestion(data.questions);
          setRemainingTime(data.total_time * 60);
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime && prevTime > 0) return prevTime - 1;
        clearInterval(timerId);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);
  useEffect(() => {
    if (remainingTime === 0) {
      handleSubmit();
      router.push("/instructionPage");
    }
  }, [remainingTime]);

  if (loading) return <p>Loading...</p>;

  if (remainingTime === null) return <p>Failed to load time.</p>;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You are not logged in.");
        return;
      }

      const answers = questionlist.map((question) => ({
        question_id: question.question_id,
        selected_option_id: selectedOptions[question.question_id] ?? null,
      }));

      const formData = new FormData();
      formData.append("answers", JSON.stringify(answers));

      const res = await AxiosInstance.post("/answers/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success === true) {
        alert("Answers submitted successfully");
        console.log("Response:", res.data);
      } else {
        console.log("Failed to submit answers", res.data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
    setSelectedOptions({});
    setUnansweredQuestions([]);
    setCurrentIndex(0);
    setShowComprehension(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-200 flex justify-center items-center">
        <p className="text-gray-700 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-center items-center md:items-center lg:items-start p-6 gap-4">
        {/* Left Side */}
        <div
          className="
        w-full        
        sm:max-w-xl   
        md:max-w-3xl  
        lg:w-3/5       
        rounded-[8px]
        bg-white
        p-6
        flex
        flex-col
        gap-6
        relative
      "
        >
          {currentQuestion.comprehension && (
            <button
              onClick={() => setShowComprehension(true)}
              className={`
            ${inter.className}
            w-[60%] sm:w-[35%]   
            h-[40px]
            bg-sky-600
            rounded-xl
            text-white
            flex
            items-center
            justify-center
            p-4
            font-medium
            text-xs
            leading-[100%]
            tracking-[0%]
          `}
            >
              <span className="md:hidden">Read</span>
              <span className="hidden md:inline-flex items-center gap-x-1">
                <Image
                  src="/image/comprehensive.png"
                  alt="comprehensive icon"
                  width={20}
                  height={20}
                />
                Read Comprehensive Paragraph{" "}
                <span className="text-xm">&#8594;</span>
              </span>
            </button>
          )}

          <h2 className={`${inter.className} font-medium text-lg`}>
            {currentQuestion.number}. {currentQuestion.question}
          </h2>

          {currentQuestion.image && currentQuestion.image.trim() !== "" && (
            <Image
              src={currentQuestion.image}
              alt="question related"
              width={300}
              height={150}
              className="rounded max-w-full h-auto"
            />
          )}

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.id}
                className="
              flex
              items-center
              justify-between
              w-full
              h-[40px]
              bg-white
              rounded-md
              px-4
              cursor-pointer
              shadow-sm
            "
              >
                <span className={`${inter.className} text-sm`}>
                  {opt.option}
                </span>
                <input
                  type="radio"
                  name={`option-${currentIndex}`}
                  value={opt.id}
                  checked={
                    selectedOptions[currentQuestion.question_id] === opt.id
                  }
                  onChange={() => handleOptionSelect(opt.id)}
                  className="cursor-pointer accent-sky-600"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-full sm:w-[40%] py-2 rounded-md ${
                currentIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-300 text-black"
              }`}
            >
              Previous
            </button>

            {currentIndex === questionlist.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full sm:w-[30%] py-2 rounded-md bg-green-600 text-white"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-[40%] py-2 rounded-md bg-sky-800 text-white"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full sm:w-[85%] lg:w-[55%] bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-row items-center justify-between mb-8">
            <h3 className="text-sm font-semibold ">Question Navigator :</h3>
            <div className="flex flex-col gap-2 lg:flex-row ">
              <h3 className="text-sm font-semibold">Remaining Time:</h3>
              <p className="flex flex-row items-center text-sm font-semibold px-2 py-1 bg-gray-800 text-white gap-3 rounded-md">
                <Image
                  src="/image/Timer.png"
                  alt="total time"
                  width={15}
                  height={4}
                />
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {questionlist.map((q, index) => {
              const questionId = q.question_id;
              const isCurrent = index === currentIndex;
              const isAnswered = !!selectedOptions[questionId];
              const isUnanswered = unansweredQuestions.includes(questionId);

              let btnClass = "bg-white text-gray-800";

              if (isCurrent) {
                btnClass = "bg-sky-600 text-white";
              } else if (isAnswered) {
                btnClass = "bg-green-500 text-white";
              } else if (isUnanswered) {
                btnClass = "bg-red-500 text-white";
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowComprehension(false);
                  }}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md border border-slate-300   ${btnClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex flex-row items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 border border-gray-400 rounded-md"></div>
              <h1 className="text-sm">Attended</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 border border-gray-400 rounded-md"></div>
              <h1 className="text-sm">Not Attended</h1>
            </div>
          </div>
        </div>
      </div>

      {showComprehension && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[800px] py-6">
            <h2
              className={`${inter.className} text-base font-semibold mb-4 w-full border-b border-slate-300 text-gray-700`}
            >
              Comprehensive Paragraph
            </h2>
            <p className={`${inter.className} text-sm font-lighttext-gray-800 whitespace-pre-wrap text-gray-600`}>
              {currentQuestion.comprehension}
            </p>
            <div className="flex justify-end">
            <button
              onClick={() => setShowComprehension(false)}
              className={`${inter.className} text-sm font-light mt-8 bg-gray-800 text-white px-28 py-2 rounded-md flex justify-end`}
            >
              Minimize
            </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="relative bg-white rounded-lg p-6
                    w-full max-w-md
                    sm:max-w-lg
                    md:max-w-md
                    lg:max-w-[23%]"
          >
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className={`${inter.className} font-medium text-base`}>
              Are you sure you want to submit the test?
            </h2>

            {(() => {
              const total = questionlist.length;
              const answered = Object.keys(selectedOptions).length;
              const unanswered = total - answered;
              return (
                <>
                  <p
                    className={`${inter.className} text-xs font-normal align-middle mb-2 flex justify-between items-center mt-6`}
                  >
                    <span className="flex items-center gap-2">
                      <Image
                        src="/image/total_quesion.png"
                        alt="total question"
                        width={20}
                        height={20}
                      />
                      Total Questions:
                    </span>
                    <span>{total}</span>
                  </p>

                  <p
                    className={`${inter.className} text-xs font-normal align-middle mb-2 flex justify-between items-center`}
                  >
                    <span className="flex items-center gap-2">
                      <Image
                        src="/image/answerd_question.png"
                        alt="answered question"
                        width={20}
                        height={20}
                      />
                      Answered Questions:
                    </span>
                    <span>{answered}</span>
                  </p>

                  <p
                    className={`${inter.className} text-xs font-normal align-middle mb-2 flex justify-between items-center`}
                  >
                    <span className="flex items-center gap-2">
                      <Image
                        src="/image/unanswerd_question.png"
                        alt="unanswered question"
                        width={20}
                        height={20}
                      />
                      Unanswered Questions:
                    </span>
                    <span>{unanswered}</span>
                  </p>
                </>
              );
            })()}

            <p
              className={`${inter.className} text-xs font-normal align-middle mb-4 flex justify-between items-center`}
            >
              <span className="flex items-center gap-2">
                <Image
                  src="/image/total_time_taked.png"
                  alt="total time"
                  width={20}
                  height={20}
                />
                Total Time Taken:
              </span>
              <span>{Math.floor(Date.now() - startTime)} seconds</span>
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="w-full sm:w-[80%] py-2 bg-gray-900 text-white rounded-md mt-6 mb-2"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
