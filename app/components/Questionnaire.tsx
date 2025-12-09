"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button";

type Question = {
  statement: string;
  spiritualGift: string;
};

type Answers = {
  [key: number]: number;
};

type QuestionnaireProps = {
  onComplete: (results: { [key: string]: number }) => void;
};

const QUESTIONS_PER_PAGE = 10;

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [unanswered, setUnanswered] = useState<number[]>([]);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
      });
  }, []);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setError(null);
    setAnswers({ ...answers, [questionIndex]: value });
    setUnanswered(unanswered.filter((item) => item !== questionIndex));
  };

  const validateCurrentPage = () => {
    const unansweredQuestions: number[] = [];
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    for (let i = 0; i < paginatedQuestions.length; i++) {
      const originalIndex = startIndex + i;
      if (answers[originalIndex] === undefined) {
        unansweredQuestions.push(originalIndex);
      }
    }
    setUnanswered(unansweredQuestions);
    return unansweredQuestions.length === 0;
  };

  const handleNextPage = () => {
    if (!validateCurrentPage()) {
      setError("Please answer all questions before proceeding.");
      return;
    }
    setError(null);
    setUnanswered([]);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    setError(null);
    setUnanswered([]);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentPage()) {
      setError("Please answer all questions before submitting.");
      return;
    }
    const newResults: { [key: string]: number } = {};
    for (const questionIndex in answers) {
      const question = questions[questionIndex];
      const answerValue = answers[questionIndex];
      const gift = question.spiritualGift;
      newResults[gift] = (newResults[gift] || 0) + answerValue;
    }
    onComplete(newResults);
  };

  return (
    <div className="w-full">
      {paginatedQuestions.map((question, index) => {
        const originalIndex =
          (currentPage - 1) * QUESTIONS_PER_PAGE + index;
        const isUnanswered = unanswered.includes(originalIndex);
        return (
          <div
            key={originalIndex}
            className={`mb-6 p-4 border rounded-lg bg-card-background ${
              isUnanswered ? "border-red-500 border-2" : "border-card-border"
            }`}
          >
            <p className="mb-4 text-lg">{question.statement}</p>
            <div className="flex justify-around">
              {[1, 2, 3, 4].map((value) => (
                <label
                  key={value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name={`question-${originalIndex}`}
                    value={value}
                    checked={answers[originalIndex] === value}
                    onChange={() => handleAnswerChange(originalIndex, value)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-around text-xs text-text-secondary mt-1">
              <span>Never</span>
              <span>Sometimes</span>
              <span>Often</span>
              <span>Always</span>
            </div>
          </div>
        );
      })}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="flex w-full justify-between items-center mt-8">
        <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>

        <Button variant="primary" onClick={currentPage === totalPages ? handleSubmit : handleNextPage}>
          {currentPage === totalPages ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}