import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'mkp224o-web',
  title: 'mkp224o Web',
  license: 'MIT',
  packageRepo: 'https://github.com/gStart9/mkp224o-web-startos',
  upstreamRepo: 'https://github.com/gStart9/mkp224o-web',
  marketingUrl: 'https://github.com/cathugger/mkp224o',
  donationUrl: null,
  description: { short, long },
  // main holds the password hash and every search with its keys.
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerBuild: {
          workdir: './upstream-project',
        },
      },
      arch: ['x86_64', 'aarch64', 'riscv64'],
    },
  },
})
