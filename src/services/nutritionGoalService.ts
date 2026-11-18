import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/auth";
import type { Tables } from "../types/database.types";

export type NutritionGoals = Tables<"user_nutrition_goals">;

export type UpdateNutritionGoalsInput = {
  calories_goal: number;
  protein_goal: number;
  carbohydrates_goal: number;
  fat_goal: number;
};

export async function getNutritionGoals(): Promise<NutritionGoals> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_nutrition_goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }

  // Fallback in case the user does not have a goals row yet.
  const { data: newGoals, error: insertError } = await supabase
    .from("user_nutrition_goals")
    .insert({ user_id: userId })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return newGoals;
}

export async function updateNutritionGoals(
  input: UpdateNutritionGoalsInput,
): Promise<NutritionGoals> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_nutrition_goals")
    .update({
      calories_goal: input.calories_goal,
      protein_goal: input.protein_goal,
      carbohydrates_goal: input.carbohydrates_goal,
      fat_goal: input.fat_goal,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
