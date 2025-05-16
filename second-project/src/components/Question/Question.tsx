'use client';
import Instructionapi from "@/utiles/instructionapi";
import Navbar from "../Navbar/Navbar";
import { Inter } from 'next/font/google';
import Image from "next/image";
import { useEffect, useState } from "react";
import AxiosInstance from "@/utiles/axiosInstance";

const inter = Inter({
  subsets: ['latin'],
  weight: ['500'], 
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
};

const Question = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComprehension, setShowComprehension] = useState(false);
  const [questionlist, setQuestion] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  const currentQuestion = questionlist[currentIndex];

const handleOptionSelect = (optionId: number) => {
  const questionId = questionlist[currentIndex].question_id;
  setSelectedOptions(prev => ({
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
    if (currentIndex < questionlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuestions();
  }, []);

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

    const res = await AxiosInstance.post('/answers/submit', formData, {
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
        <div className="w-[60%] rounded-[8px] bg-white p-6 flex flex-col gap-6 relative">

          {currentQuestion.comprehension && (
            <button
              onClick={() => setShowComprehension(true)}
              className={`${inter.className} w-[35%] h-[40px] bg-sky-600 rounded-xl text-white flex items-center justify-center p-4 font-medium text-xs leading-[100%] tracking-[0%]`}
            >
              <span className="md:hidden">Read</span>
              <span className="hidden md:inline-flex items-center gap-x-1">
                <Image src="/image/comprehensive.png" alt="comprehensive icon" width={20} height={20} />
                Read Comprehensive Paragraph <span className="text-xm">&#8594;</span>
              </span>
            </button>
          )}

          <h2 className={`${inter.className} font-medium text-lg`}>
            {currentQuestion.question_id}. {currentQuestion.question}
          </h2>

          {currentQuestion.image && currentQuestion.image.trim() !== "" && (
            <Image
              src={currentQuestion.image}
              alt="question related"
              width={300}
              height={150}
              className="rounded"
            />
          )}

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between w-full h-[40px] bg-white rounded-md px-4 cursor-pointer shadow-sm"
              >
                <span className={`${inter.className} text-sm`}>{opt.option}</span>
                <input
                  type="radio"
                  name={`option-${currentIndex}`} 
                  value={opt.id}
                  checked={selectedOptions[currentQuestion.question_id] === opt.id}
                  onChange={() => handleOptionSelect(opt.id)}
                  className="cursor-pointer accent-sky-600"
                />
              </label>
            ))}
          </div>

          <div className="flex gap-4 mt-4 items-center justify-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-[40%] py-2 rounded-md ${
                currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 text-black"
              }`}
            >
              Previous
            </button>

            {currentIndex === questionlist.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="w-[30%] py-2 rounded-md bg-green-600 text-white"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-[40%] py-2 rounded-md bg-sky-800 text-white"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-[35%] bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-3">
            {questionlist.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowComprehension(false);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-medium ${
                  index === currentIndex
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-sky-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehension Modal */}
      {showComprehension && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-xl w-[90%]">
            <h2 className="text-lg font-semibold mb-4">Comprehension</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{currentQuestion.comprehension}</p>
            <button
              onClick={() => setShowComprehension(false)}
              className="mt-6 bg-sky-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
