import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/auth";
import type { Database } from "../types/database.types";

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

type MealScheduleInsert =
  Database["public"]["Tables"]["meal_schedules"]["Insert"];

type MealScheduleUpdate =
  Database["public"]["Tables"]["meal_schedules"]["Update"];

type MealType = Database["public"]["Enums"]["meal_type"];
type MealCategory = Database["public"]["Enums"]["meal_category"];

export interface CreateMealScheduleInput {
  meal_id?: string | null;
  meal_name: string;
  category: MealCategory;
  date: string;
  meal_type: MealType;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  notes?: string | null;
}

export type UpdateMealScheduleInput = Partial<CreateMealScheduleInput>;

export async function getMealSchedulesByDate(
  date: string,
): Promise<MealSchedule[]> {
  const { data, error } = await supabase
    .from("meal_schedules")
    .select("*")
    .eq("date", date)
    .order("meal_type", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMealSchedulesByDateRange(
  startDate: string,
  endDate: string,
): Promise<MealSchedule[]> {
  const { data, error } = await supabase
    .from("meal_schedules")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("meal_type", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMealScheduleById(id: string): Promise<MealSchedule> {
  const { data, error } = await supabase
    .from("meal_schedules")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMealSchedule(
  input: CreateMealScheduleInput,
): Promise<MealSchedule> {
  const userId = await getCurrentUserId();

  const payload: MealScheduleInsert = {
    ...input,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from("meal_schedules")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMealSchedule(
  id: string,
  input: UpdateMealScheduleInput,
): Promise<MealSchedule> {
  const payload: MealScheduleUpdate = {
    ...input,
  };

  const { data, error } = await supabase
    .from("meal_schedules")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMealSchedule(id: string): Promise<void> {
  const { error } = await supabase.from("meal_schedules").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
