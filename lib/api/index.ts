// Export simple API functions
export { authApi, publicApi } from "./simpleApi";
import { API_ENDPOINTS } from "./endpoints";
export const { AUTH, DASHBOARD, ASSISTANT, SETTINGS, TASKS, WEALTH, GOALS } = API_ENDPOINTS;
export * from "./wealth";
export * from "./goals";
