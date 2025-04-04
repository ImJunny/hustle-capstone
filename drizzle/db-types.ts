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
  "paid",
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
export const tagTypes = [
  { name: "home", value: "home" },
  { name: "tech", value: "tech" },
  { name: "yardwork", value: "yardwork" },
  { name: "beauty", value: "beauty" },
  { name: "food", value: "food" },
  { name: "vehicles", value: "vehicles" },
  { name: "fashion", value: "fashion" },
  { name: "finance", value: "finance" },
  { name: "community", value: "community" },
  { name: "travel", value: "travel" },
  { name: "moving", value: "moving" },
  { name: "sports", value: "sports" },
  { name: "health", value: "health" },
  { name: "education", value: "education" },
  { name: "gaming", value: "gaming" },
  { name: "misc", value: "misc" },
  { name: "art", value: "art" },
  { name: "other", value: "other" },
  { name: "labor", value: "labor" },
  { name: "pets", value: "pets" },
  { name: "music", value: "music" },
  { name: "cleaning", value: "cleaning" },
  { name: "transportation", value: "transportation" },
  { name: "repairs", value: "repairs" },
  { name: "photography", value: "photography" },
  { name: "writing", value: "writing" },
  { name: "fitness", value: "fitness" },
  { name: "cooking", value: "cooking" },
  { name: "events", values: "events" },
  { name: "fitness", values: "fitness" },
] as const;
