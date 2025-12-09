"use client";

import { useState } from "react";
import { useTheme } from "@/app/components/theme-provider";
import { Questionnaire } from "@/app/components/Questionnaire";
import { Results } from "@/app/components/Results";


type ResultsData = {
  [key: string]: number;
};

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ResultsData>({});
  const { theme, setTheme } = useTheme();

  const handleComplete = (finalResults: ResultsData) => {
    setResults(finalResults);
    setShowResults(true);
  };

  const handleRetake = () => {
    setResults({});
    setShowResults(false);
  };

  return (
    <main className="container mx-auto max-w-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Spiritual Gifts Test</h1>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-md border"
        >
          {theme === "light" ? (
            <img src="/dark.svg" alt="Dark mode" width={20} height={20} />
          ) : (
            <img src="/light.svg" alt="Light mode" width={20} height={20} />
          )}
        </button>
      </div>

      <p className="mb-4">
        This Spiritual Gifts test should be taken in a single sitting. It
        consists of 57 statements that you are to quickly rate depending on how
        much it applies to you. You can finish this test in about 5-10 minutes.
        Be open and honest with your answers. Enjoy!
      </p>

      {showResults ? (
        <Results results={results} onRetake={handleRetake} />
      ) : (
        <Questionnaire onComplete={handleComplete} />
      )}
    </main>
  );
}