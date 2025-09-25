export const ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
  },
  APP: {
    DASHBOARD: "/app/dashboard",
    // PROFILE: "/app/profile",
    // SETTINGS: "/app/settings",
  },
  PUBLIC: {
    HOME: "/",
    FEATURES: "/features",
    PRICING: "/pricing",
    PRODUCT: "/product",
    TERMS: "/terms",
    PRIVACY: "/privacy",
    // ABOUT: "/about",
    // CONTACT: "/contact",
  },
} as const;
