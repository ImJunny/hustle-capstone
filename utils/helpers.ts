import { format, isThisYear } from "date-fns";

export const getGeneralDate = (date: string) => {
  return date
    ? isThisYear(new Date(date))
      ? format(new Date(date), "MMMM d")
      : format(new Date(date), "MMMM d, yyyy")
    : null;
};

export function safeJsonParse<T>(input: string | undefined, fallback: T): T {
  try {
    return input ? JSON.parse(input) : fallback;
  } catch {
    return fallback;
  }
}
