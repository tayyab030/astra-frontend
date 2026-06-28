// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/jwt/create/",
    REGISTER: "/auth/users/",
    REFRESH_ACCESS_TOKEN: "/auth/jwt/refresh/",
    VERIFY_TOKEN: "/auth/jwt/verify/",
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
    // PROFILE: "/user/profile",
    // UPDATE_PROFILE: "/user/profile",
    // CHANGE_PASSWORD: "/user/change-password",
    // UPLOAD_AVATAR: "/user/avatar",
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
    PROJECTS: "/tasks/projects/",
    PROJECT_TASKS: (projectId: string) =>
      `/tasks/projects/${projectId}/tasks/`,
    // TAGS: "/tasks/tags/",
    // COMPLETED_TASKS: "/tasks/completed-tasks/",
  },

  // Wealth endpoints
  WEALTH: {
    DASHBOARD: "/wealth/",
    TRANSACTIONS: "/wealth/transactions/",
    TRANSACTION: (id: string) => `/wealth/transactions/${id}/`,
    SAVINGS: "/wealth/savings/",
    SAVING: (id: string) => `/wealth/savings/${id}/`,
    SAVINGS_WITHDRAW: "/wealth/savings/withdraw/",
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
