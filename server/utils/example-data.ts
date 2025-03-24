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
  progress?: "accepted" | "in progress" | "paid" | "overdue" | "awaiting";
  accepted_count?: number;
};

export type Review = {
  uuid: string;
  user_uuid: string;
  description: string;
  user_name: string;
  rating: number;
  date: string;
};
export type ExamplePost = {
  title: string;
  uuid: string;
  min_rate: number;
  max_rate: number | null;
  location_type: string;
  due_date: string;
  image_url: string;
  type: "work" | "hire";
};

export const examplePosts: ExamplePost[] = [
  {
    uuid: "jhgddj",
    title: "Design a poster",
    min_rate: 75,
    max_rate: 100,
    location_type: "remote",
    due_date: "March 20",
    type: "work",
    image_url: "http://picsum.photos/800/800",
  },
];

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
    progress: "in progress",
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
    progress: "accepted",
    accepted_count: 3,
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
    progress: "awaiting",
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
    progress: "paid",
  },
  {
    type: "work",
    uuid: "tyddawdytss",
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
    progress: "paid",
  },
];

export const exampleServicePosts: TPost[] = [
  {
    type: "hire",
    uuid: "jhgd425dj",
    user_uuid: "jhgddj",
    title: "Digital Designer",
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
    uuid: "dwa6537daw",
    user_uuid: "jhgddj",
    title: "Mover",
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
    uuid: "asd5245fsaf",
    user_uuid: "jhgddj",
    title: "Yardwork Service",
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
    uuid: "tydw737637asytss",
    user_uuid: "jhgddj",
    title: "Painter",
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
  job_title?: string;
  progress?: "accepted" | "in progress" | "paid" | "overdue" | "awaiting" | "viewed";
  messageHistory: Array<{
    message: string;
    timestamp: string; // ISO string format or Date object
    date: string; // Date in YYYY-MM-DD format (or any desired format)
    sent: boolean;
  }>;
};

export const exampleMessages: TMessage[] = [
  {
    uuid: "kiyfkifa",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Kevin So",
    is_job: true,
    job_title: "Digital Designer",
    messageHistory: [
      {
        message: "Lorem ipsum dolor sit amet",
        timestamp: "2025-03-23T10:00:00.000Z",
        date: "2025-03-23",
        sent: true
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
        timestamp: "2025-03-23T10:05:00.000Z",
        date: "2025-03-23",
        sent: false
      }
    ]
  },
  {
    uuid: "bnhdnhd",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Jason Smith",
    messageHistory: [
      {
        message: "Hey! How’s the project going?",
        timestamp: "2025-03-17T14:00:00.000Z",
        date: "2025-03-17",
        sent: true
      },
      {
        message: "It’s going well, thanks!",
        timestamp: "2025-03-17T14:05:00.000Z",
        date: "2025-03-17",
        sent: false
      }
    ]
  },
  {
    uuid: "fwefewfw",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Sam Johnson",
    messageHistory: [
      {
        message: "I’ve got the final report ready. Should I send it over?",
        timestamp: "2025-03-20T09:30:00.000Z",
        date: "2025-03-20",
        sent: true
      },
      {
        message: "Yes, please send it over as soon as possible.",
        timestamp: "2025-03-20T09:32:00.000Z",
        date: "2025-03-20",
        sent: false
      }
    ]
  },
  {
    uuid: "hgshgsh",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Tyler Dud",
    is_job: true,
    job_title: "Web Developer",
    messageHistory: [
      {
        message: "Happy to meet you! Let’s catch up soon.",
        timestamp: "2025-03-19T18:45:00.000Z",
        date: "2025-03-19",
        sent: true
      },
      {
        message: "Looking forward to it! Talk soon.",
        timestamp: "2025-03-19T18:47:00.000Z",
        date: "2025-03-19",
        sent: false
      }
    ]
  },
  {
    uuid: "fdafaefea",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    last_message: "5 weeks ago",
    messenger: "Barbara Henry",
    is_job: true,
    job_title: "Project Manager",
    messageHistory: [
      {
        message: "Reminder: Your meeting is in 15 minutes.",
        timestamp: "2025-03-20T09:55:00.000Z",
        date: "2025-03-20",
        sent: true
      },
      {
        message: "Got it, thanks for the reminder!",
        timestamp: "2025-03-20T09:57:00.000Z",
        date: "2025-03-20",
        sent: false
      }
    ]
  },
];
export type TProfile = {
  uuid: string;
  bio: string;
  user_name: string;
  name: string;
};

export const exampleProfile: TProfile = {
  uuid: "kiyfkifa",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
  user_name: "@some_user",
  name: "Kevin So",
};

export const exampleReview: Review[] = [
  {
    uuid: "jhgddj",
    user_uuid: "jhgddj",
    description:
      "Fantastic dining experience! The ambiance was cozy and welcoming, and the staff were exceptionally friendly and attentive. The food was flavorful and beautifully presented. My favorite dish was the truffle pasta—absolutely divine! The dessert selection was also impressive. Overall, a perfect spot for a special occasion or a casual meal. Highly recommend!",
    user_name: "@some_user",
    rating: 5,
    date: "December 13, 2025",
  },

  {
    uuid: "dwadaw",
    user_uuid: "dwadaw",
    description:
      "An engrossing read from start to finish! The author's storytelling prowess shines through in this captivating novel. The characters are well-developed and relatable, and the plot twists keep you on the edge of your seat. The vivid descriptions and immersive world-building make it easy to get lost in the story. A must-read for fans of the genre!",
    user_name: "@some_user",
    rating: 5,
    date: "December 25, 2025",
  },

  {
    uuid: "asdfsaf",
    user_uuid: "asdfsaf",
    description:
      "A cinematic masterpiece! The film's direction and cinematography are top-notch, and the performances by the cast are outstanding. The storyline is compelling and thought-provoking, with just the right mix of drama and action. The soundtrack perfectly complements the visuals, enhancing the overall experience. Definitely worth watching on the big screen!",
    user_name: "@some_user",
    rating: 5,
    date: "December 7, 2025",
  },

  {
    uuid: "tydwasytss",
    user_uuid: "tydwasytss",
    description:
      "Excellent quality and value for money! This product exceeded my expectations in every way. It's durable, easy to use, and performs exceptionally well. The sleek design and user-friendly features make it a standout choice. The customer service was also prompt and helpful. Highly satisfied with my purchase and would recommend it to others.",
    user_name: "@some_user",
    date: "March 25, 2025",
    rating: 5,
  },
];
