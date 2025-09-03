// app/actions/voteHandler.ts

import { supabase } from "@/lib/supabaseClient";

/**
 * Optimized vote handler.
 * - Uses maybeSingle() for cleaner error handling
 * - Selects only "id" instead of "*"
 * - Reduces duplicate query conditions
 * - Uses early returns for readability
 */
export async function voteHandler(pollId: string, optionId: string, userId: string) {
  // Check if the user already has a vote
  const { data: existingVote, error } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (existingVote) {
    // Update existing vote
    const { error: updateError } = await supabase
      .from("votes")
      .update({ option_id: optionId })
      .eq("id", existingVote.id);

    if (updateError) throw new Error(updateError.message);
    return { status: "updated" };
  }

  // Insert new vote
  const { error: insertError } = await supabase
    .from("votes")
    .insert({ poll_id: pollId, option_id: optionId, user_id: userId });

  if (insertError) throw new Error(insertError.message);
  return { status: "created" };
}