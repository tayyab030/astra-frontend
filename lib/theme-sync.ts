/**
 * Prevents late profile/session fetches from overwriting a theme the user just picked.
 * Capture a token before an async fetch; only apply the server theme if the token
 * still matches when the response arrives.
 */

let themeSyncGeneration = 0

export function noteThemeUserChange() {
  themeSyncGeneration += 1
}

export function captureThemeSyncToken() {
  return themeSyncGeneration
}

export function canApplyServerTheme(token: number) {
  return token === themeSyncGeneration
}
