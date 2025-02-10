export const categories = [
  { id: 1, title: "Tech" },
  { id: 2, title: "Health" },
  { id: 3, title: "Home Care" },
  { id: 4, title: "Food" },
  { id: 5, title: "Education" },
  { id: 6, title: "Gaming" },
];

export type TPost = {
  uuid: string;
  user_uuid: string;
  title: string;
  description: string;
  min_rate: number;
  max_rate?: number;
  tags: string[];
  distance: string;
  status?: string;
  due_date?: string;
  type: "work" | "hire";
  comments?: number;
  user_name: string;
  time_ago: string;
};

export const exampleJobPosts: TPost[] = [
  {
    type: "work",
    uuid: "jhgddj",
    user_uuid: "jhgddj",
    title: "Design a poster",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 75,
    max_rate: 100,
    tags: ["design", "art", "media"],
    distance: "remote",
    due_date: "March 20",
    comments: 4,
    status: "2  accepted",
    user_name: "@sukmoon44",
    time_ago: "1 hr ago",
  },
  {
    type: "work",
    uuid: "dwadaw",
    user_uuid: "jhgddj",
    title: "I need help moving ASAP!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 200,
    tags: ["transporting", "home"],
    distance: "< 10 mi",
    due_date: "February 7",
    user_name: "@samdoe",
    time_ago: "1 day ago",
  },
  {
    type: "work",
    uuid: "asdfsaf",
    user_uuid: "jhgddj",
    title: "Lawn mowing needed",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 5 mi",
    due_date: "February 8",
    comments: 1,
    user_name: "@johnsmith",
    time_ago: "7 hrs ago",
  },
  {
    type: "work",
    uuid: "tydwasytss",
    user_uuid: "jhgddj",
    title: "Painter Needed for Building Meural at XYZ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 450,
    max_rate: 600,
    tags: ["art", "painting"],
    distance: "< 15 mi",
    due_date: "July 3",
    status: "7 accepted",
    user_name: "@some_user",
    time_ago: "1 mo ago",
  },
];

export const exampleServicePosts: TPost[] = [
  {
    type: "hire",
    uuid: "jhgddj",
    user_uuid: "jhgddj",
    title: "Design a poster",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 75,
    max_rate: 100,
    tags: ["design", "art", "media"],
    distance: "remote",
    comments: 4,
    user_name: "@sukmoon44",
    time_ago: "1 hr ago",
  },
  {
    type: "hire",
    uuid: "dwadaw",
    user_uuid: "jhgddj",
    title: "I need help moving ASAP!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 200,
    tags: ["transporting", "home"],
    distance: "< 10 mi",
    user_name: "@samdoe",
    time_ago: "1 day ago",
  },
  {
    type: "hire",
    uuid: "asdfsaf",
    user_uuid: "jhgddj",
    title: "Lawn mowing needed",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 50,
    max_rate: 100,
    tags: ["yardwork", "home"],
    distance: "< 5 mi",
    comments: 1,
    user_name: "@johnsmith",
    time_ago: "7 hrs ago",
  },
  {
    type: "hire",
    uuid: "tydwasytss",
    user_uuid: "jhgddj",
    title: "Painter Needed for Building Meural at XYZ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    min_rate: 450,
    max_rate: 600,
    tags: ["art", "painting"],
    distance: "< 15 mi",
    user_name: "@some_user",
    time_ago: "1 mo ago",
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
