import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Subject, StudyLog, WeeklySchedule, AIRecommendation, UserProfile, ExamRecord } from '../types';
import { INITIAL_SUBJECTS, WEEKLY_BASE_SCHEDULE, INITIAL_BADGES } from '../constants';
import { Toast } from '../components/Toast';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  studyLogs: StudyLog[];
  setStudyLogs: (logs: StudyLog[]) => void;
  exams: ExamRecord[];
  setExams: (exams: ExamRecord[]) => void;
  schedule: WeeklySchedule;
  setSchedule: (schedule: WeeklySchedule) => void;
  recommendations: AIRecommendation[];
  setRecommendations: (recommendations: AIRecommendation[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFocusMode: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;
  isLoggingSession: boolean;
  setIsLoggingSession: (isLoggingSession: boolean) => void;
  activeSession: {
    subjectId: string;
    topicId: string;
    elapsedSeconds: number;
    totalSeconds: number;
  } | null;
  setActiveSession: (activeSession: AppState['activeSession']) => void;
  activeSubjectId: string | null;
  setActiveSubjectId: (id: string | null) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  isNowPlayingOpen: boolean;
  setIsNowPlayingOpen: (open: boolean) => void;
  isAuthReady: boolean;
  setIsAuthReady: (ready: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  highlightedSubjectId: string | null;
  setHighlightedSubjectId: (id: string | null) => void;
  recentlyStudied: string[];
  setRecentlyStudied: (ids: string[]) => void;
  addRecentlyStudied: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  userProfile: {
    points: 0,
    streak: 0,
    badges: INITIAL_BADGES,
    totalSessions: 0,
    totalStudyTime: 0
  },
  setUserProfile: (profile) => set({ userProfile: profile }),
  subjects: INITIAL_SUBJECTS,
  setSubjects: (subjects) => set({ subjects }),
  studyLogs: [],
  setStudyLogs: (logs) => set({ studyLogs: logs }),
  exams: [],
  setExams: (exams) => set({ exams }),
  schedule: WEEKLY_BASE_SCHEDULE,
  setSchedule: (schedule) => set({ schedule }),
  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isFocusMode: false,
  setIsFocusMode: (isFocusMode) => set({ isFocusMode }),
  isLoggingSession: false,
  setIsLoggingSession: (isLoggingSession) => set({ isLoggingSession }),
  activeSession: null,
  setActiveSession: (activeSession) => set({ activeSession }),
  activeSubjectId: null,
  setActiveSubjectId: (id) => set({ activeSubjectId: id }),
  isPaused: false,
  setIsPaused: (isPaused) => set({ isPaused }),
  isNowPlayingOpen: true,
  setIsNowPlayingOpen: (isNowPlayingOpen) => set({ isNowPlayingOpen }),
  isAuthReady: false,
  setIsAuthReady: (isAuthReady) => set({ isAuthReady }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  highlightedSubjectId: null,
  setHighlightedSubjectId: (id) => set({ highlightedSubjectId: id }),
  recentlyStudied: [],
  setRecentlyStudied: (ids) => set({ recentlyStudied: ids }),
  addRecentlyStudied: (id) => set((state) => {
    const filtered = state.recentlyStudied.filter(tid => tid !== id);
    return { recentlyStudied: [id, ...filtered].slice(0, 10) };
  }),
}));
