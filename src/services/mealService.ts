import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/auth";
import type { Database } from "../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];
type MealInsert = Database["public"]["Tables"]["meals"]["Insert"];
type MealUpdate = Database["public"]["Tables"]["meals"]["Update"];

type MealCategory = Database["public"]["Enums"]["meal_category"];

export interface CreateMealInput {
  name: string;
  description?: string | null;
  category: MealCategory;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  image_url?: string | null;
}

export type UpdateMealInput = Partial<CreateMealInput>;

export interface GetMealsOptions {
  search?: string;
  category?: MealCategory;
  includeArchived?: boolean;
}

export async function getMeals(options: GetMealsOptions = {}): Promise<Meal[]> {
  let query = supabase
    .from("meals")
    .select("*")
    .order("created_at", { ascending: false });

  if (!options.includeArchived) {
    query = query.is("archived_at", null);
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.search?.trim()) {
    query = query.ilike("name", `%${options.search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMealById(id: string): Promise<Meal> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMeal(input: CreateMealInput): Promise<Meal> {
  const userId = await getCurrentUserId();

  const payload: MealInsert = {
    ...input,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from("meals")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMeal(
  id: string,
  input: UpdateMealInput,
): Promise<Meal> {
  const payload: MealUpdate = {
    ...input,
  };

  // 1. Update the main meal data.
  const { data, error } = await supabase
    .from("meals")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // 2. Synchronize existing meal schedules.
  const { error: scheduleError } = await supabase
    .from("meal_schedules")
    .update({
      meal_name: data.name,
      category: data.category,
      calories: data.calories,
      protein: data.protein,
      carbohydrates: data.carbohydrates,
      fat: data.fat,
    })
    .eq("meal_id", id);

  if (scheduleError) {
    throw new Error(
      `Meal updated, but failed to synchronize scheduled meals: ${scheduleError.message}`,
    );
  }

  return data;
}

export async function archiveMeal(id: string): Promise<Meal> {
  const { data, error } = await supabase
    .from("meals")
    .update({
      archived_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function restoreMeal(id: string): Promise<Meal> {
  const { data, error } = await supabase
    .from("meals")
    .update({
      archived_at: null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase.from("meals").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
