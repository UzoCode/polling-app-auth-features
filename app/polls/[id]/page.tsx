"use client";

import { useState } from "react";

type PollOption = {
  id: string;
  text: string;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
};

const mockPoll: Poll = {
  id: "1",
  question: "What is your favorite programming language?",
  options: [
    { id: "1", text: "JavaScript" },
    { id: "2", text: "Python" },
    { id: "3", text: "Rust" },
    { id: "4", text: "Go" },
  ],
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      // For now: just set state
      setHasVoted(true);
    }
  };

  if (hasVoted) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Thank you for voting!</h2>
        <p className="text-gray-600">Poll results will be shown here...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6">{mockPoll.question}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mockPoll.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name="poll"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
              className="h-4 w-4 text-blue-600"
            />
            <span>{option.text}</span>
          </label>
        ))}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          disabled={!selectedOption}
        >
          Submit Vote
        </button>
      </form>
    </div>
  );
}