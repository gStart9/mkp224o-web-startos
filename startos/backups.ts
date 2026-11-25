import { sdk } from './sdk'

// The main volume holds the private keys that the searches found, so all of it is backed up.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main'),
)
