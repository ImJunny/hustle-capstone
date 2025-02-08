export const categories = [
  { id: 1, title: "Tech" },
  { id: 2, title: "Health" },
  { id: 3, title: "Home Care" },
  { id: 4, title: "Food" },
  { id: 5, title: "Education" },
  { id: 6, title: "Gaming" },
];

export type TJobPost = {
  uuid: string;
  title: string;
  description: string;
  min_rate: number;
  max_rate?: number;
  tags: string[];
  distance: string;
  status?: string;
  date: string;
  comments?: number;
};
export const exampleJobPosts: TJobPost[] = [
  {
    uuid: "asdfsaf",
    title: "Yard Work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 10 mi",
    date: "February 8",
    comments: 1,
  },
  {
    uuid: "dwadaw",
    title: "Yard Work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 10 mi",
    date: "February 8",
    status: "1 accepted",
  },
  {
    uuid: "jhgddj",
    title: "Yard Work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 10 mi",
    date: "February 8",
    comments: 4,
  },
  {
    uuid: "tydwasytss",
    title: "Yard Work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 10 mi",
    date: "February 8",
    status: "7 accepted",
  },
];
