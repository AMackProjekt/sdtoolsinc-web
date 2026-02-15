export type CertificateRecord = {
  courseId: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  score?: number;
};

export type LearningProgress = {
  enrolledCourses: string[];
  completedLessons: string[];
  certificates: CertificateRecord[];
};

const DEFAULT_PROGRESS: LearningProgress = {
  enrolledCourses: [],
  completedLessons: [],
  certificates: [],
};

function getStorageKey(userId: string) {
  return `toolsinc-progress:${userId}`;
}

export function loadLearningProgress(userId: string): LearningProgress {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROGRESS };
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as LearningProgress;
    return {
      enrolledCourses: parsed.enrolledCourses || [],
      completedLessons: parsed.completedLessons || [],
      certificates: parsed.certificates || [],
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveLearningProgress(userId: string, progress: LearningProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(progress));
}

export function cacheLearningProgress(userId: string, progress: LearningProgress): void {
  saveLearningProgress(userId, progress);
}

export function updateLearningProgress(userId: string, updates: Partial<LearningProgress>): LearningProgress {
  const current = loadLearningProgress(userId);
  const next: LearningProgress = {
    enrolledCourses: updates.enrolledCourses ?? current.enrolledCourses,
    completedLessons: updates.completedLessons ?? current.completedLessons,
    certificates: updates.certificates ?? current.certificates,
  };
  saveLearningProgress(userId, next);
  return next;
}

export function addEnrollment(userId: string, courseId: string): LearningProgress {
  const current = loadLearningProgress(userId);
  if (current.enrolledCourses.includes(courseId)) return current;
  return updateLearningProgress(userId, {
    enrolledCourses: [...current.enrolledCourses, courseId],
  });
}

export function addLessonCompletion(userId: string, lessonId: string): LearningProgress {
  const current = loadLearningProgress(userId);
  if (current.completedLessons.includes(lessonId)) return current;
  return updateLearningProgress(userId, {
    completedLessons: [...current.completedLessons, lessonId],
  });
}

export function addCertificate(userId: string, certificate: CertificateRecord): LearningProgress {
  const current = loadLearningProgress(userId);
  return updateLearningProgress(userId, {
    certificates: [...current.certificates, certificate],
  });
}
