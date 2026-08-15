/** Keep in sync with package.json version. */
export const APP_NAME = "Astra"
export const APP_VERSION = "0.1.0"
export const APP_COPYRIGHT_HOLDER = "Astra"

export function getAppCopyright(year = new Date().getFullYear()) {
  return `© ${year} ${APP_COPYRIGHT_HOLDER}`
}
