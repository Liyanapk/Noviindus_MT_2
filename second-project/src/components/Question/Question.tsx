'use client'
import Navbar from "../Navbar/Navbar"
import { Inter } from 'next/font/google';
import Image from "next/image";
import { useState } from "react";

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
  number: number;
  question: string;
  image: string;
  options: Option[];
};

const questionlist: Question[] = [
  {
    comprehension: "Web design is the process of creating the visual and functional aspects of websites. It involves a mix of creativity and technical skills.",
    number: 1,
    question: "What is web design used for?",
    image: "/image/banner.png",
    options: [
      { id: 18, option: "To create mobile apps", is_correct: false, image: null },
      { id: 19, option: "To develop software", is_correct: false, image: null },
      { id: 20, option: "To design and build websites", is_correct: true, image: null },
      { id: 21, option: "To manage servers", is_correct: false, image: null },
    ]
  },
  {
    comprehension: "Web design is the process of creating the visual and functional aspects of websites. It involves a mix of creativity and technical skills.",
    number: 2,
    question: "What is web design used for?",
    image: "",
    options: [
      { id: 18, option: "To create mobile apps", is_correct: false, image: null },
      { id: 19, option: "To develop software", is_correct: false, image: null },
      { id: 20, option: "To design and build websites", is_correct: true, image: null },
      { id: 21, option: "To manage servers", is_correct: false, image: null },
    ]
  },
];

const Question = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComprehension, setShowComprehension] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const currentQuestion = questionlist[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOptionId(null);
      setShowComprehension(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setShowComprehension(false);
    }
  };

  return (
<div className="min-h-screen  bg-slate-200">
  <Navbar />
  <div className="flex flex-col lg:flex-row justify-center items-center md:items-center lg:items-start p-6 gap-4"> 
    {/* Left Side - Question Section */}
    <div className="w-[60%] rounded-[8px] bg-white p-6 flex flex-col gap-6 relative">
      {/* Comprehension Popup */}
      {showComprehension && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowComprehension(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg"
            onClick={e => e.stopPropagation()} 
          >
            <h3 className={`${inter.className} font-semibold text-lg mb-4`}>Comprehension</h3>
            <p className="text-sm">{currentQuestion.comprehension}</p>
            <button
              onClick={() => setShowComprehension(false)}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Read Comprehension Button */}
      <button
        onClick={() => setShowComprehension(true)}
        className={`${inter.className} w-[60%] h-[40px] bg-sky-600 rounded-xl text-white flex items-center justify-center p-4 font-medium text-xs leading-[100%] tracking-[0%]`}
      >
        <span className="md:hidden">Read</span>
        <span className="hidden md:inline-flex items-center gap-x-1">
          <Image src="/image/comprehensive.png" alt="comprehensive icon" width={20} height={20} />
          Read Comprehensive Paragraph <span className="text-xm">&#8594;</span>
        </span>
      </button>

      {/* Question */}
      <h2 className={`${inter.className} font-medium text-lg`}>
        {currentQuestion.number}. {currentQuestion.question}
      </h2>

      {/* Question Image */}
      {currentQuestion.image && currentQuestion.image.trim() !== "" && (
        <Image
          src={currentQuestion.image}
          alt="question related"
          width={300}
          height={150}
          className="rounded"
        />
      )}

      {/* Options */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center justify-between w-full h-[40px] bg-white rounded-md px-4 cursor-pointer shadow-sm"
          >
            <span className={`${inter.className} text-sm`}>{opt.option}</span>
            <input
              type="radio"
              name="option"
              value={opt.id}
              checked={selectedOptionId === opt.id}
              onChange={() => setSelectedOptionId(opt.id)}
              className="cursor-pointer accent-sky-600"
            />
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`w-[30%] py-2 rounded-md ${
            currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-sky-600 text-white"
          }`}
        >
          Previous
        </button>
        <button
          disabled={currentIndex === questionlist.length - 1}
          className={`w-[30%] py-2 rounded-md ${
            currentIndex === questionlist.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-sky-600 text-white"
          }`}
        >
          Submit
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questionlist.length - 1}
          className={`w-[30%] py-2 rounded-md ${
            currentIndex === questionlist.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-sky-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>

  
   {/* Right Side - Question Number Sheet */}
<div className="w-[35%]  bg-white rounded-lg p-6 shadow-md">
  <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
  <div className="grid grid-cols-5 gap-3">
    {questionlist.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
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
</div>



  );
}

export default Question;
