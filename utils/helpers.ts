import { format, formatDistanceToNow, isThisYear } from "date-fns";

export const getGeneralDate = (date: string) => {
  return date
    ? isThisYear(new Date(date))
      ? format(new Date(date), "MMMM d")
      : format(new Date(date), "MMMM d, yyyy")
    : null;
};

export const safeJsonParse = <T>(input: string | undefined, fallback: T): T => {
  try {
    return input ? JSON.parse(input) : fallback;
  } catch {
    return fallback;
  }
};

export const getRelativeDate = (date: string) => {
  const formattedTimeAgo = formatDistanceToNow(date, {
    addSuffix: true,
  })
    .replace("about", "")
    .replace("hours", "hrs")
    .replace("hour", "hr")
    .replace("minutes", "mins")
    .replace("minute", "min")
    .replace("seconds", "secs")
    .replace("second", "sec")
    .trim();
  return formattedTimeAgo;
};
