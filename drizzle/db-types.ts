export const tagTypes = [
  { name: "home", value: "home" },
  { name: "tech", value: "tech" },
  { name: "yardwork", value: "yardwork" },
  { name: "beauty", value: "beauty" },
  { name: "food", value: "food" },
  { name: "vehicle", value: "vehicle" },
  { name: "moving", value: "moving" },
  { name: "sports", value: "sports" },
  { name: "health", value: "health" },
  { name: "education", value: "education" },
  { name: "gaming", value: "gaming" },
  { name: "misc", value: "misc" },
  { name: "art", value: "art" },
  { name: "other", value: "other" },
] as const;
export const locationTypes = ["remote", "local"] as const;
export const statusTypes = [
  "hidden",
  "draft",
  "open",
  "initiated",
  "complete",
] as const;
export const progressTypes = [
  "accepted",
  "approved",
  "in progress",
  "complete",
] as const;
export const onboardingPhaseTypes = [
  "date of birth",
  "username",
  "display name",
  "profile image",
  "completed",
];
export const messageTypes = ["text", "post", "progress"] as const;
export const reviewerTypes = ["employer", "employee"] as const;
