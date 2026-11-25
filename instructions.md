# mkp224o Web

## Documentation

- [mkp224o README](https://github.com/cathugger/mkp224o/blob/master/README.md) — how mkp224o works, how long searches take, and how to use the keys with your own Tor.
- [mkp224o-web README](https://github.com/gStart9/mkp224o-web/blob/master/README.md) — the web interface: patterns, the queue, core pinning and the key browser.

## What you get on StartOS

- A **Web UI** interface, behind a password, where you queue searches for vanity `.onion` addresses and download the keys that they find.
- Searches that run **one at a time**, in the order that you queue them. A search that was running when the service stopped picks up again when the service starts.
- Every key on the service's own storage, included in your StartOS backups. Each search keeps its keys in a folder with the search's name.

## Getting set up

1. Run the **Set Password** action. It shows you a new random password. Copy the password somewhere safe.
2. Start the service, then open the **Web UI** interface and log in with the password.

## Using mkp224o Web

### Starting a search

Give the search a name, then add one or more patterns. A key is saved when its address matches any of the patterns.

- A **prefix** is the start of the address that you want, such as `shop`. Addresses use only the letters `a`–`z` and the digits `2`–`7`, so there is no `0`, `1`, `8` or `9`. A prefix can be up to 12 characters long.
- A **regex** is a PCRE regular expression that is matched from the first character of the address. For example, `[a-z]*shop` finds `shop` anywhere in the letters at the start. Every address ends in `d`, so a regex that requires another last character never matches.

Each extra character makes a search about 32 times longer. Once a search has run for a few seconds, the form shows how long a new prefix search should take on your server.

**Threads** sets how many CPU threads the search uses. **Pin to cores** keeps the search on the cores that you list, such as `0-3` or `0,2`, which leaves the other cores free for the rest of your services. **Stop after** ends the search after that many keys. Leave **Stop after** empty to search until you stop the search yourself.

### Managing searches

Each search shows its state, its speed, how long it has run, and how many keys it has found. **Stop** ends a running search, and **Resume** continues the search later with the same settings. **Download** saves the whole search folder as a `.tar.gz` archive. **Delete** removes the search folder and every key in the folder.

Click a search to list its keys. For each key, you can copy the address, download the key folder, or delete the key.

### Using a key for a service on this server

1. In mkp224o Web, click **Copy key for StartOS Tor** next to the key.
2. Open the interface of the other service that should use the address, and add an onion address in the interface's **Tor** table.
3. Paste the copied key as the private key.

The Tor service must be installed for the **Tor** table to appear. The copied key is the address's private key, so anyone who has the key can run a service at that address. Don't paste the key anywhere else.

### Using a key somewhere else

Download the key and unpack the archive. The `<address>.onion` folder is a Tor hidden service directory, which the mkp224o README explains how to use.

### Actions

- **Set Password** generates a new random password for the web interface and shows the password once. Run the action again if you lose the password. The new password works immediately, and every browser that is logged in has to log in again.
