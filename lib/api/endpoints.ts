// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/jwt/create/",
    REGISTER: "/auth/users/",
    REFRESH_ACCESS_TOKEN: "/auth/jwt/refresh/",
    VERIFY_TOKEN: "/auth/jwt/verify/",
    ME: "/auth/me/",
    OTP_STATUS: (token: string) => `/otp/${token}/status/`,
    RESEND_OTP: "/otp/create/",
    RESEND_OTP_LOGIN: "/otp/resend-login/",
    VERIFY_OTP: "/otp/verify/",
    FORGOT_PASSWORD: "/auth/password/forgot/",
    RESET_PASSWORD: "/auth/password/reset/",
    PASSWORD_RESET_STATUS: (token: string) =>
      `/auth/password/${token}/status/`,
  },

  // User endpoints
  USER: {
    PROFILE: "/auth/me/",
    UPDATE_PROFILE: "/auth/me/",
  },

  // Dashboard endpoints
  DASHBOARD: {
    // ANALYTICS: "/dashboard/analytics",
    // HEALTH_SCORE: "/dashboard/health-score",
    // GOALS: "/dashboard/goals",
    // TASKS: "/dashboard/tasks",
    // NOTES: "/dashboard/notes",
    // WEALTH: "/dashboard/wealth",
    // COMMUNICATION: "/dashboard/communication",
  },

  // Tasks endpoints
  TASKS: {
    LIST: "/tasks/",
    TASK: (id: string) => `/tasks/${id}/`,
    PROJECTS: "/tasks/projects/",
    PROJECT: (id: string) => `/tasks/projects/${id}/`,
    PROJECT_TASKS: (projectId: string) =>
      `/tasks/projects/${projectId}/tasks/`,
  },

  // Goals endpoints
  GOALS: {
    DASHBOARD: "/goals/",
    GOALS: "/goals/",
    GOAL: (id: string) => `/goals/${id}/`,
    MILESTONES: (goalId: string) => `/goals/${goalId}/milestones/`,
    MILESTONE: (goalId: string, milestoneId: string) =>
      `/goals/${goalId}/milestones/${milestoneId}/`,
  },

  // Wealth endpoints
  WEALTH: {
    DASHBOARD: "/wealth/",
    TRANSACTIONS: "/wealth/transactions/",
    TRANSACTION: (id: string) => `/wealth/transactions/${id}/`,
    BUDGETS: "/wealth/budgets/",
    BUDGET: (id: string) => `/wealth/budgets/${id}/`,
  },

  // Time track endpoints
  TIME_TRACK: {
    DASHBOARD: "/time-track/",
    ENTRIES: "/time-track/entries/",
    ENTRY: (id: string) => `/time-track/entries/${id}/`,
    TRACKED_TASKS: "/time-track/tracked-tasks/",
    TRACKED_TASK: (taskId: string) => `/time-track/tracked-tasks/${taskId}/`,
    SETTINGS: "/time-track/settings/",
  },

  // Health endpoints
  HEALTH: {
    DASHBOARD: "/health/",
    PROFILE: "/health/profile/",
    TARGETS: "/health/targets/",
    METRICS_ADJUST: "/health/metrics/adjust/",
    WEIGHT: "/health/weight/",
    HABITS: "/health/habits/",
    HABIT_TOGGLE: (id: string) => `/health/habits/${id}/toggle/`,
    WORKOUTS: "/health/workouts/",
    MOOD: "/health/mood/",
  },

  // Notes endpoints
  NOTES: {
    DASHBOARD: "/notes/",
    NOTES: "/notes/",
    NOTE: (id: string) => `/notes/${id}/`,
    PERMANENT: (id: string) => `/notes/${id}/permanent/`,
    RESTORE: (id: string) => `/notes/${id}/restore/`,
    ARCHIVE: (id: string) => `/notes/${id}/archive/`,
    DUPLICATE: (id: string) => `/notes/${id}/duplicate/`,
    BULK: "/notes/bulk/",
    RESTORE_VERSION: (id: string) => `/notes/${id}/versions/restore/`,
  },

  // Assistant endpoints
  ASSISTANT: {
    // CHAT: "/assistant/chat",
    // HISTORY: "/assistant/history",
    // CLEAR_HISTORY: "/assistant/clear-history",
  },

  // Settings endpoints
  SETTINGS: {
    // PREFERENCES: "/settings/preferences",
    // NOTIFICATIONS: "/settings/notifications",
    // PRIVACY: "/settings/privacy",
  },
} as const;
