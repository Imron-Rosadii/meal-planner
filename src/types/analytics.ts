export interface DailyNutrition {
  date: string;
  day: string;
  mealCount: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface NutritionGoalsData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface MacroDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;

  activeDayCount: number;

  averageCalories: number;
  averageProtein: number;
  averageCarbohydrates: number;
  averageFat: number;

  highestDay: DailyNutrition | null;
  lowestDay: DailyNutrition | null;
}
