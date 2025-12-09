"use client";

import { Button } from "./Button";

type ResultsProps = {
  results: { [key: string]: number };
  onRetake: () => void;
};

export function Results({ results, onRetake }: ResultsProps) {
  const getTopGifts = () => {
    const sortedGifts = Object.entries(results).sort(([, a], [, b]) => b - a);
    const topGifts: { gift: string; score: number; rank: number }[] = [];
    let rank = 0;
    let lastScore = Infinity;
    for (let i = 0; i < sortedGifts.length; i++) {
      const [gift, score] = sortedGifts[i];
      if (score < lastScore) {
        rank++;
        lastScore = score;
      }
      if (rank > 5) break;
      topGifts.push({ gift, score, rank });
    }
    return topGifts;
  };

  const topGifts = getTopGifts();
  const groupedGifts = topGifts.reduce((acc, { gift, score, rank }) => {
    if (!acc[rank]) {
      acc[rank] = { gifts: [], score: score };
    }
    acc[rank].gifts.push(gift);
    return acc;
  }, {} as { [key: number]: { gifts: string[], score: number } });

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Your Top 5 Spiritual Gifts
      </h1>
      <div className="w-full">
        {Object.entries(groupedGifts).map(([rank, { gifts, score }]) => (
          <div
            key={rank}
            className="mb-4 p-4 border rounded-lg bg-card-background border-card-border"
          >
            <h2 className="text-xl font-bold">
              Rank {rank}: {gifts.join(", ")}
            </h2>
            <p className="text-text-secondary">Score: {score}</p>
          </div>
        ))}
      </div>
      <Button variant="primary" onClick={onRetake} className="mt-8"> Retake Test </Button>
    </>
  );
}