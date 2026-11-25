export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Web Interface': 0,
  'The web interface is ready': 1,
  'The web interface is not ready': 2,

  // interfaces.ts
  'Web UI': 3,
  'Start vanity onion address searches, watch their progress, and download or copy the keys that they find.': 4,

  // actions/setPassword.ts
  'Set Password': 5,
  'Generate a new random password for the web interface. Replaces any existing password.': 6,
  'Replaces the current password and signs out every browser that is logged in.': 7,
  Password: 8,
  'Log in to the web interface with this password.': 9,

  // init/watchPassword.ts
  'Set a password before you log in to the web interface.': 10,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
