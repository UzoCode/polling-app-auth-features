"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

// Add this for a simple toast
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  );
}

// Initialize Supabase client (replace with your actual keys or use env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PollOption = {
  id: string;
  text: string;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<{ [optionId: string]: number }>({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      // Fetch poll and its options from Supabase
      const { data, error } = await supabase
        .from("polls")
        .select("id, question, options:poll_options(id, text)")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setPoll({
          id: data.id,
          question: data.question,
          options: data.options || [],
        });
      } else {
        setPoll(null);
      }
    };

    fetchPoll();
  }, [params.id]);

// Fetch poll results after voting
  useEffect(() => {
    const fetchResults = async () => {
      if (!poll) return;
      const { data, error } = await supabase
        .from("votes")
        .select("option_id, count:id")
        .eq("poll_id", poll.id)
        // .group("option_id");

      if (!error && data) {
        // data: [{ option_id: "1", count: 5 }, ...]
        const counts: { [optionId: string]: number } = {};
        data.forEach((row: any) => {
          counts[row.option_id] = row.count;
        });
        setResults(counts);
      }
    };

    if (hasVoted && poll) {
      fetchResults();
    }
  }, [hasVoted, poll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) {
      setShowError(true);
      return;
    }
    if (selectedOption && poll) {
      const { error } = await supabase.from("votes").insert([
        {
          poll_id: poll.id,
          option_id: selectedOption,
        },
      ]);
      if (!error) {
        setHasVoted(true);
      } else {
        alert("Failed to record vote. Please try again.");
      }
    }
  };

  if (!poll) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Loading poll...</h2>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Thank you for voting!</h2>
        <p className="text-gray-600 mb-4">Poll results:</p>
        <ul>
          {poll.options.map((option) => (
            <li key={option.id} className="mb-2 flex justify-between">
              <span>{option.text}</span>
              <span className="font-bold">
                {results[option.id] ?? 0} vote{(results[option.id] ?? 0) === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      {showError && (
        <Toast message="Please select an option before submitting." onClose={() => setShowError(false)} />
      )}
      <h1 className="text-2xl font-bold mb-6">{poll.question}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {poll.options.map((option) => (
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