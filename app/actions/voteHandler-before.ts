// app/actions/voteHandler-before.ts

import { supabase } from "@/lib/supabaseClient";

/**
 * Handles user voting on a poll.
 * If user already voted, update their vote.
 * If not, insert a new one.
 */
export async function voteHandler(pollId: string, optionId: string, userId: string) {
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("poll_id", pollId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(fetchError.message);
  }

  if (existingVote) {
    const { error: updateError } = await supabase
      .from("votes")
      .update({ option_id: optionId })
      .eq("poll_id", pollId)
      .eq("user_id", userId);

    if (updateError) throw new Error(updateError.message);
    return { status: "updated" };
  } else {
    const { error: insertError } = await supabase
      .from("votes")
      .insert({ poll_id: pollId, option_id: optionId, user_id: userId });

    if (insertError) throw new Error(insertError.message);
    return { status: "created" };
  }
}
