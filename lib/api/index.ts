// Export simple API functions
export { authApi, publicApi } from "./simpleApi";
import { API_ENDPOINTS } from "./endpoints";
export const { AUTH, DASHBOARD, ASSISTANT, SETTINGS, TASKS, WEALTH } = API_ENDPOINTS;
export * from "./wealth";
