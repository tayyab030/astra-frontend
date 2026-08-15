export const habitsKeys = {
  all: ["habits"] as const,
  list: () => [...habitsKeys.all, "list"] as const,
}
