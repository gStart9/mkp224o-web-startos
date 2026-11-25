import { utils } from '@start9labs/start-sdk'
import { passwordHash } from '../fileModels/passwordHash'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { appEnv } from '../utils'

export const setPassword = sdk.Action.withoutInput(
  'set-password',

  async ({ effects }) => ({
    name: i18n('Set Password'),
    description: i18n(
      'Generate a new random password for the web interface. Replaces any existing password.',
    ),
    warning: (await passwordHash.read().const(effects))?.trim()
      ? i18n(
          'Replaces the current password and signs out every browser that is logged in.',
        )
      : null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 24,
    })

    // mkp224o-web hashes the password and writes the hash file itself. The running
    // server reads the file on every login, so the new password works without a restart.
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'set-password',
      (sub) =>
        sub.execFail(['mkp224o-web', 'set-password'], {
          env: { ...appEnv, MKP_NEW_PASSWORD: password },
        }),
    )

    return {
      version: '1',
      title: i18n('Password'),
      message: i18n('Log in to the web interface with this password.'),
      result: {
        type: 'single',
        value: password,
        masked: true,
        copyable: true,
        qr: false,
        launchable: false,
      },
    }
  },
)
