export const tagTypes = ["home", "tech", "art", "gaming", "other"] as const;
export const locationTypes = ["remote", "local"] as const;
export const statusTypes = [
  "hidden",
  "draft",
  "open",
  "initiated",
  "complete",
] as const;
export const progressTypes = ["accepted", "in progress", "complete"] as const;
export const onboardingPhaseTypes = [
  "date of birth",
  "username",
  "display name",
  "profile image",
  "completed",
];
export const messageTypes = ["text", "post", "progress"] as const;
export const reviewerTypes = ["employer", "employee"] as const;
