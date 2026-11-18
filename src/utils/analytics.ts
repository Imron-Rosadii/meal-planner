export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function getProgress(value: number, target: number): number {
  if (target <= 0) return 0;

  return Math.round((value / target) * 100);
}
