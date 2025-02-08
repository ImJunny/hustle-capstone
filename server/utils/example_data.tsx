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
    title: "Lawn mowing needed",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 5 mi",
    date: "February 8",
    comments: 1,
  },
  {
    uuid: "dwadaw",
    title: "I need help moving ASAP!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 200,
    tags: ["transport", "home"],
    distance: "< 10 mi",
    date: "February 7",
    status: "1 accepted",
  },
  {
    uuid: "jhgddj",
    title: "Design a poster",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 60,
    tags: ["design", "art", "media"],
    distance: "remote",
    date: "March 20",
    comments: 4,
  },
  {
    uuid: "tydwasytss",
    title: "Painter Needed for Building Meural",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 450,
    max_rate: 600,
    tags: ["art", "painting"],
    distance: "< 15 mi",
    date: "July 3",
    status: "7 accepted",
  },
];

export type TServicePost = {
  uuid: string;
  title: string;
  description: string;
  min_rate: number;
  max_rate?: number;
  tags: string[];
  distance: string;
  user_rating?: number;
};
export const exampleServicePosts: TServicePost[] = [
  {
    uuid: "asdfsaf",
    title: "Yardwork Service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 5 mi",
    user_rating: 4.9,
  },
  {
    uuid: "dwadaw",
    title: "Mover",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 200,
    tags: ["transport", "home"],
    distance: "< 10 mi",
  },
  {
    uuid: "jhgddj",
    title: "Digital Media Designer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 60,
    tags: ["design", "art", "media"],
    distance: "remote",
    user_rating: 4.4,
  },
  {
    uuid: "tydwasytss",
    title: "Painter",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 450,
    max_rate: 600,
    tags: ["art", "painting"],
    distance: "< 15 mi",
    user_rating: 5,
  },
];

export type TMessage = {
  uuid: string;
  message: string;
  last_message: string;
  messenger: string;
  is_job?: boolean;
};

export const exampleMessages: TMessage[] = [
  {
    uuid: "kiyfkifa",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Kevin So",
    is_job: true,
  },
  {
    uuid: "bnhdnhd",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Jason Smith",
  },
  {
    uuid: "fwefewfw",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Sam Johnson",
  },
  {
    uuid: "hgshgsh",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Tyler Dud",
    is_job: true,
  },
  {
    uuid: "fdafaefea",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Barbara Henry",
    is_job: true,
  },
];
