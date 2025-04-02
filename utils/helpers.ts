import { format, isThisYear } from "date-fns";

export const getGeneralDate = (date: string) => {
  return date
    ? isThisYear(new Date(date))
      ? format(new Date(date), "MMMM d")
      : format(new Date(date), "MMMM d, yyyy")
    : null;
};
