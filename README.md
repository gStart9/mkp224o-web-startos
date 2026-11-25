<p align="center">
  <img src="icon.svg" alt="mkp224o Web Logo" width="21%">
</p>

# mkp224o Web on StartOS

> Everything not listed in this document should behave the same as upstream
> mkp224o Web. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[mkp224o Web](https://github.com/gStart9/mkp224o-web) is a password-protected web front end for [mkp224o](https://github.com/cathugger/mkp224o), the vanity address generator for Tor v3 onion services. It queues named searches, runs them one at a time, and keeps each search's keys in a folder of their own.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The image is built from the Dockerfile in mkp224o-web, which is the `upstream-project` git submodule. That Dockerfile compiles mkp224o from its upstream release tag twice: once with 64-bit integer filters for prefix searches, and once with PCRE2 for regex searches. It also compiles the mkp224o-web server.

| Property      | Value                                                                                  |
| ------------- | -------------------------------------------------------------------------------------- |
| Image source  | Custom Dockerfile, from the `upstream-project` submodule                               |
| Architectures | x86_64, aarch64, riscv64                                                               |
| ed25519 code  | `amd64-51-30k` assembly on x86_64, `donna` on aarch64 and riscv64                      |
| Entrypoint    | `mkp224o-web serve`, with its environment set by the package                           |
| Binaries      | `/usr/local/bin/mkp224o-web`, `/usr/local/bin/mkp224o`, `/usr/local/bin/mkp224o-regex` |

The daemon runs in one subcontainer named `mkp224o-web`. While a search runs, mkp224o is a child process of the server in the same subcontainer, started through `taskset` when the search is pinned to cores. The **Set Password** action runs `mkp224o-web set-password` in a temporary subcontainer named `set-password`.

mkp224o is compiled without `-march=native`, so one image runs on every CPU of its architecture.

## Volume and Data Layout

All data is in one volume, mounted at `/data`.

| Path                                   | Contents                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| `/data/password.hash`                  | The argon2 hash of the web interface password                                          |
| `/data/keys/<search>/search.json`      | A search's patterns, threads, cores, key limit, state and total run time               |
| `/data/keys/<search>/<address>.onion/` | A key that mkp224o found: `hostname`, `hs_ed25519_public_key`, `hs_ed25519_secret_key` |

A folder under `/data/keys/` without a `search.json` is listed in the web interface as a plain folder of keys, which can be browsed, downloaded and deleted but not resumed.

## File Models

The package models one file, `password.hash`, read-only. mkp224o-web writes the file through its `set-password` command, and the package reads the file only to decide whether to raise the password task and whether **Set Password** needs a confirmation. The file holds a PHC-format argon2id hash. A hand edit to a valid hash of another password works, and an empty or missing file locks the web interface.

The server's settings are environment variables that the package sets on every start: `MKP_DATA_DIR`, `MKP_LISTEN`, `MKP_MKP224O` and `MKP_MKP224O_REGEX`. There is no configuration file.

## Dependencies

None. The **Copy key for StartOS Tor** button produces a key that the Tor service accepts, but mkp224o Web neither needs Tor nor talks to Tor.

## Network Access and Interfaces

| Interface | Id   | Type | Port | Protocol | Purpose                                        |
| --------- | ---- | ---- | ---- | -------- | ---------------------------------------------- |
| Web UI    | `ui` | `ui` | 8080 | HTTP     | The search form, the queue and the key browser |

The server listens on `[::]:8080`. It makes no outbound connections.

## Installation and First-Run Flow

The server starts with no password, and every login fails until one is set. Install raises a critical task for **Set Password**, so the service cannot start until the action has run. There is no setup wizard in the web interface.

## Actions

**Set Password** (`set-password`)

- **When to run it:** first, to clear the install task; later, when the password is lost or should change.
- **What it changes:** it generates a 24-character random password and runs `mkp224o-web set-password`, which replaces `/data/password.hash`.
- **Cost:** about a second. The running server reads the hash on every login, so there is no restart, and running searches continue.
- **Repeat safety:** each run replaces the password. Sessions are tied to the hash that they logged in under, so every logged-in browser is signed out.
- **Outputs:** the new password, masked and copyable. The password is not stored anywhere in plain text, so it cannot be shown again.

## Tasks

**Set Password**, `critical`. Init raises the task while `/data/password.hash` is missing or empty, which is the case after a fresh install. Running **Set Password** clears the task. The task returns only if the hash file is deleted or emptied, for example by a restore of a backup that was made before a password was set.

## Health Checks

**Web Interface** (`primary`) requests `http://localhost:8080/api/session`, which needs no login. A failure means that the server is not answering. The server starts in well under a second, so a failure that lasts beyond the first check points to a crash; read the service log.

A failing search does not affect the health check. The search shows as `failed` in the web interface, with mkp224o's last error message.

## Backups and Restore

The whole `main` volume is copied, which includes the password hash, every search's settings and every key. Keys are private keys, so the backup is as sensitive as the keys themselves. A restored instance needs nothing more: the old password works, and a search that was queued or running at backup time goes back in the queue on the next start.

## Limitations and Differences

1. Only one search runs at a time. Other searches wait in the queue until the running search finishes or is stopped.
2. A prefix is at most 12 characters, because the prefix build of mkp224o uses 64-bit integer filters. A longer prefix would take far too long to find anyway.
3. Login sessions are held in memory, so every browser has to log in again after the service restarts.
4. A search's key limit counts the keys in its folder. Deleting keys from a finished search lets **Resume** find more keys, up to the limit again.

---

## Quick Reference for AI Consumers

```yaml
package_id: mkp224o-web
image: built from upstream-project/Dockerfile
architectures: [x86_64, aarch64, riscv64]
subcontainers: [mkp224o-web, set-password]
volumes:
  main: /data
file_models:
  - password.hash
startos_managed_env_vars:
  - MKP_DATA_DIR
  - MKP_LISTEN
  - MKP_MKP224O
  - MKP_MKP224O_REGEX
dependencies: none
interfaces:
  ui: { type: ui, port: 8080 }
actions:
  - set-password
tasks:
  - { action: set-password, severity: critical }
health_checks:
  - primary
```
