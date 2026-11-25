import { setPassword } from '../actions/setPassword'
import { passwordHash } from '../fileModels/passwordHash'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

// Until a password is set, mkp224o-web refuses every login, and this task tells the user
// to run Set Password.
export const watchPassword = sdk.setupOnInit(async (effects) => {
  const hash = await passwordHash.read().const(effects)
  if (!hash?.trim()) {
    await sdk.action.createOwnTask(effects, setPassword, 'critical', {
      reason: i18n('Set a password before you log in to the web interface.'),
    })
  }
})
