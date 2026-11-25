import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// The argon2 hash that mkp224o-web checks logins against. Only mkp224o-web writes this
// file, through its `set-password` command, so the package reads it and never writes it.
export const passwordHash = FileHelper.string({
  base: sdk.volumes.main,
  subpath: 'password.hash',
})
