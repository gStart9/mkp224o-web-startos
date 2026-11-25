// The port that mkp224o-web listens on inside the container.
export const uiPort = 8080

// The environment that mkp224o-web reads. The main volume is mounted at /data.
export const appEnv = {
  MKP_DATA_DIR: '/data',
  MKP_LISTEN: `[::]:${uiPort}`,
  MKP_MKP224O: '/usr/local/bin/mkp224o',
  MKP_MKP224O_REGEX: '/usr/local/bin/mkp224o-regex',
}
