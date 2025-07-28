export const dummyPosts = [
  {
    id: "1",
    user: {
      id: "2",
      username: "alice_dev",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content:
      "Just finished building a new React component library! 🚀 The developer experience is amazing with TypeScript and Storybook integration. Can't wait to share it with the community!",
    images: ["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2"],
    likes: 42,
    comments: [],
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user: {
      id: "3",
      username: "bob_coder",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    content:
      "Working on a new machine learning project using Python and TensorFlow. The results are looking promising! 🤖 Anyone else working with AI/ML lately?",
    images: ["https://picsum.photos/400/300?random=3"],
    likes: 28,
    comments: [],
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    user: {
      id: "4",
      username: "charlie_js",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    content:
      "Just deployed my first Next.js 14 app with the new App Router. The performance improvements are incredible! Server components are a game changer 💯",
    images: [],
    likes: 35,
    comments: [],
    timestamp: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    user: {
      id: "5",
      username: "diana_react",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    content: "Created this beautiful dashboard with React and D3.js. Data visualization has never been more fun! 📊✨",
    images: ["https://picsum.photos/400/300?random=4", "https://picsum.photos/400/300?random=5"],
    likes: 67,
    comments: [],
    timestamp: "2024-01-15T07:20:00Z",
  },
]

export const recommendedUsers = [
  {
    id: "5",
    username: "diana_react",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "React enthusiast & UI/UX designer 🎨",
  },
  {
    id: "6",
    username: "eve_python",
    avatar: "https://i.pravatar.cc/150?img=6",
    bio: "Data scientist & Python developer 🐍",
  },
  {
    id: "7",
    username: "frank_node",
    avatar: "https://i.pravatar.cc/150?img=7",
    bio: "Backend developer specializing in Node.js ⚡",
  },
  {
    id: "8",
    username: "grace_mobile",
    avatar: "https://i.pravatar.cc/150?img=8",
    bio: "Mobile app developer | React Native 📱",
  },
]

export const chatUsers = [
  {
    id: "2",
    username: "alice_dev",
    avatar: "https://i.pravatar.cc/150?img=2",
    isOnline: true,
    lastMessage: "Hey! How's the project going?",
    timestamp: "2m",
    unreadCount: 2,
  },
  {
    id: "3",
    username: "bob_coder",
    avatar: "https://i.pravatar.cc/150?img=3",
    isOnline: false,
    lastMessage: "Thanks for the code review!",
    timestamp: "1h",
    unreadCount: 0,
  },
  {
    id: "4",
    username: "charlie_js",
    avatar: "https://i.pravatar.cc/150?img=4",
    isOnline: true,
    lastMessage: "Let's pair program tomorrow",
    timestamp: "3h",
    unreadCount: 1,
  },
  {
    id: "5",
    username: "diana_react",
    avatar: "https://i.pravatar.cc/150?img=5",
    isOnline: false,
    lastMessage: "Great work on the UI!",
    timestamp: "1d",
    unreadCount: 0,
  },
  {
    id: "6",
    username: "eve_python",
    avatar: "https://i.pravatar.cc/150?img=6",
    isOnline: true,
    lastMessage: "Check out this ML model",
    timestamp: "2d",
    unreadCount: 0,
  },
]

export const communities = [
  {
    id: "1",
    name: "React Developers",
    description: "A community for React developers to share knowledge, best practices, and build amazing UIs together.",
    members: 15420,
    avatar: "https://picsum.photos/100/100?random=10",
  },
  {
    id: "2",
    name: "Python Programmers",
    description:
      "Everything Python - from web development to data science and machine learning. All skill levels welcome!",
    members: 23150,
    avatar: "https://picsum.photos/100/100?random=11",
  },
  {
    id: "3",
    name: "JavaScript Masters",
    description: "Advanced JavaScript concepts, frameworks, and modern development practices. Level up your JS skills!",
    members: 18750,
    avatar: "https://picsum.photos/100/100?random=12",
  },
  {
    id: "4",
    name: "DevOps Engineers",
    description: "CI/CD, containerization, cloud infrastructure, and automation discussions for modern deployment.",
    members: 12300,
    avatar: "https://picsum.photos/100/100?random=13",
  },
  {
    id: "5",
    name: "UI/UX Designers",
    description:
      "Design systems, user experience, and frontend development collaboration. Create beautiful interfaces!",
    members: 9800,
    avatar: "https://picsum.photos/100/100?random=14",
  },
  {
    id: "6",
    name: "Mobile Developers",
    description: "React Native, Flutter, iOS, and Android development community. Build apps that users love!",
    members: 14200,
    avatar: "https://picsum.photos/100/100?random=15",
  },
]

export const stories = [
  {
    id: "1",
    user: {
      username: "alice_dev",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    image: "https://picsum.photos/300/500?random=30",
    timestamp: "2h ago",
    isNew: true,
  },
  {
    id: "2",
    user: {
      username: "bob_coder",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    image: "https://picsum.photos/300/500?random=31",
    timestamp: "4h ago",
    isNew: true,
  },
  {
    id: "3",
    user: {
      username: "charlie_js",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    image: "https://picsum.photos/300/500?random=32",
    timestamp: "6h ago",
    isNew: false,
  },
  {
    id: "4",
    user: {
      username: "diana_react",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    image: "https://picsum.photos/300/500?random=33",
    timestamp: "8h ago",
    isNew: true,
  },
]

export const trendingTopics = [
  {
    id: "1",
    name: "React 18",
    posts: 12500,
    emoji: "⚛️",
  },
  {
    id: "2",
    name: "Next.js 14",
    posts: 8900,
    emoji: "🚀",
  },
  {
    id: "3",
    name: "TypeScript",
    posts: 15600,
    emoji: "📘",
  },
  {
    id: "4",
    name: "AI/ML",
    posts: 22100,
    emoji: "🤖",
  },
  {
    id: "5",
    name: "Web3",
    posts: 7800,
    emoji: "🌐",
  },
]

export const userPosts = [
  {
    id: "1",
    image: "https://picsum.photos/300/300?random=20",
    likes: 45,
    comments: 12,
  },
  {
    id: "2",
    image: "https://picsum.photos/300/300?random=21",
    likes: 32,
    comments: 8,
  },
  {
    id: "3",
    image: "https://picsum.photos/300/300?random=22",
    likes: 67,
    comments: 15,
  },
  {
    id: "4",
    image: "https://picsum.photos/300/300?random=23",
    likes: 23,
    comments: 5,
  },
  {
    id: "5",
    image: "https://picsum.photos/300/300?random=24",
    likes: 89,
    comments: 22,
  },
  {
    id: "6",
    image: "https://picsum.photos/300/300?random=25",
    likes: 56,
    comments: 18,
  },
  {
    id: "7",
    image: "https://picsum.photos/300/300?random=26",
    likes: 34,
    comments: 9,
  },
  {
    id: "8",
    image: "https://picsum.photos/300/300?random=27",
    likes: 78,
    comments: 25,
  },
  {
    id: "9",
    image: "https://picsum.photos/300/300?random=28",
    likes: 41,
    comments: 11,
  },
]
