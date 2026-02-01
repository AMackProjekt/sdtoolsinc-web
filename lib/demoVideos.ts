/**
 * Demo Video Content Library
 * Placeholder video URLs and metadata for T.O.O.L.S Inc demo page
 */

export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export const demoVideos: DemoVideo[] = [
  {
    id: "dashboard-overview",
    title: "Personal Dashboard Overview",
    description: "Case Manager Preview - Navigate your client cases, track progress, and manage outcomes",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "📊",
    duration: "1:45",
    category: "casemgr",
  },
  {
    id: "enrollment-process",
    title: "Course Enrollment Process",
    description: "Browse and enroll in courses, access learning materials, and track your progress",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "📚",
    duration: "2:10",
    category: "learning",
  },
  {
    id: "ai-coach-demo",
    title: "MackAI Motivational Coach",
    description: "LLM-powered AI assistant providing personalized motivation, guidance, and support",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "🤖",
    duration: "1:55",
    category: "ai",
  },
  {
    id: "communication-platform",
    title: "Client-Case Manager Communication",
    description: "Secure messaging between clients and their case managers with real-time updates",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "💬",
    duration: "2:05",
    category: "communication",
  },
  {
    id: "profile-setup",
    title: "Profile Setup & Preferences",
    description: "Complete your profile with demographics, contact info, and learning preferences",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "👤",
    duration: "1:30",
    category: "setup",
  },
  {
    id: "quiz-system",
    title: "Quiz & Certificate System",
    description: "Take course quizzes, earn certificates, and track your achievements",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "🏆",
    duration: "2:20",
    category: "learning",
  },
];

export function getDemoVideosByCategory(category: string): DemoVideo[] {
  return demoVideos.filter((video) => video.category === category);
}

export function getDemoVideoById(id: string): DemoVideo | undefined {
  return demoVideos.find((video) => video.id === id);
}/**
 * Demo Video Content Library
 * Placeholder video URLs and metadata for T.O.O.L.S Inc demo page
 */

export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export const demoVideos: DemoVideo[] = [
  {
    id: "dashboard-overview",
    title: "Personal Dashboard Overview",
    description: "Case Manager Preview - Navigate your client cases, track progress, and manage outcomes",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "📊",
    duration: "1:45",
    category: "casemgr"
  },
  {
    id: "enrollment-process",
    title: "Course Enrollment Process",
    description: "Browse and enroll in courses, access learning materials, and track your progress",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "📚",
    duration: "2:10",
    category: "learning"
  },
  {
    id: "ai-coach-demo",
    title: "MackAI Motivational Coach",
    description: "LLM-powered AI assistant providing personalized motivation, guidance, and support",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "🤖",
    duration: "1:55",
    category: "ai"
  },
  {
    id: "communication-platform",
    title: "Client-Case Manager Communication",
    description: "Secure messaging between clients and their case managers with real-time updates",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "💬",
    duration: "2:05",
    category: "communication"
  },
  {
    id: "profile-setup",
    title: "Profile Setup & Preferences",
    description: "Complete your profile with demographics, contact info, and learning preferences",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "👤",
    duration: "1:30",
    category: "setup"
  },
  {
    id: "quiz-system",
    title: "Quiz & Certificate System",
    description: "Take course quizzes, earn certificates, and track your achievements",
    videoUrl: "https://videos.pexels.com/video-files/5729126/5729126-hd_1920_1080_25fps.mp4",
    thumbnail: "🏆",
    duration: "2:20",
    category: "learning"
  }
];

export function getDemoVideosByCategory(category: string): DemoVideo[] {
  return demoVideos.filter(v => v.category === category);
}

export function getDemoVideoById(id: string): DemoVideo | undefined {
  return demoVideos.find(v => v.id === id);
}
