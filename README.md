# Multitenant Micro-Frontend POC

Runtime-composed micro-frontends with **per-tenant configuration** and **feature flags**, built on **Vite + Module Federation** and **React**.

## What this demonstrates

- **3 independent MFE modules** — `dashboard`, `analytics`, `settings` — each its own Vite app, built and deployable on its own, exposed as a federated remote.
- **A shell (host)** that composes them at runtime. No module is bundled into the shell; each is fetched via its `remoteEntry.js`.
- **Multitenancy** — a single deployment serves multiple tenants. The active tenant is read from `?tenant=<id>` (default `abc`) and switchable in the top bar.
- **Feature flags** — per-tenant flags decide which modules appear *and* which features render inside each module. In **Admin mode** a live panel (scoped to the module you're viewing) lets you toggle flags at runtime to preview behavior. In **User mode** the panel is hidden.
- **Configurable per user/tenant** — everything tenant-specific (theme, entitled modules, flags, plan) lives in one local JSON file. No code change to onboard a tenant.

## Architecture

```
                       fetch /config/tenants.json
                                   │
                          ┌────────▼────────┐
   ?tenant=acme  ───────► │   Shell (host)  │  :5000
                          │  - loads config │
                          │  - themes UI    │
                          │  - builds nav   │
                          │  - passes {tenant, flags} as props
                          └───┬──────┬──────┬┘
              import()        │      │      │        (Module Federation, runtime)
                 ┌────────────┘      │      └────────────┐
        ┌────────▼───────┐  ┌────────▼───────┐  ┌────────▼───────┐
        │ dashboard :5001│  │ analytics :5002│  │ settings  :5003│
        │  remoteEntry   │  │  remoteEntry   │  │  remoteEntry   │
        └────────────────┘  └────────────────┘  └────────────────┘
```

Feature flags flow **shell → module as props**, so modules stay free of global state and are testable in isolation (each has a standalone dev harness in `src/main.jsx`).

## Config model (`packages/shell/public/config/tenants.json`)

```jsonc
{
  "abc": {
    "name": "ABC Industries",
    "plan": "enterprise",
    "theme": { "primary": "#2563eb", "logo": "🔷" },
    "modules": ["dashboard", "analytics", "settings"],   // which remotes to mount
    "flags": {                                            // feature toggles, prefixed by module
      "dashboard.revenueWidget": true,
      "analytics.csvExport": true,
      "settings.betaSecurityPanel": true
    }
  }
}
```

The three seeded tenants differ deliberately. **Settings is enabled for every tenant**; **analytics** is the module that varies:

| Tenant          | Plan       | Modules                         | Notable flags off |
|-----------------|------------|---------------------------------|-------------------|
| ABC Industries  | enterprise | dashboard, analytics, settings  | (all on)          |
| XYZ Corporation | pro        | dashboard, settings             | activityFeed, betaSecurityPanel (no analytics module) |
| PQR Group       | starter    | dashboard, analytics, settings  | revenueWidget, csvExport, realtime, all settings flags |

Switch tenants in the UI to watch modules appear/disappear and features toggle. Flag keys are prefixed with their module (`dashboard.*`, `analytics.*`, `settings.*`); the admin flag panel shows only the flags for the module currently on screen.

## Run it

Module Federation resolves remotes over HTTP, so remotes must be served (built + previewed). One command does everything:

```bash
npm install          # installs all workspaces
npm start            # builds all remotes + shell, serves everything
```

Then open **http://localhost:5000** (try `?tenant=xyz` or `?tenant=pqr`, and `?mode=admin` to reveal the flag panel).

Ports: shell `5000`, dashboard `5001`, analytics `5002`, settings `5003`.

### Faster shell iteration
```bash
npm run dev          # builds+previews the 3 remotes, runs the shell in Vite dev mode
```

### Run a single module standalone
```bash
npm run dev --workspace=dashboard   # http://localhost:5001, uses mock tenant/flags
```

## Where to look

| Concern              | File |
|----------------------|------|
| Tenant/flag config   | `packages/shell/public/config/tenants.json` |
| Config loading + theming + nav + admin mode | `packages/shell/src/App.jsx` |
| Runtime flag playground (admin only, per-module) | `packages/shell/src/App.jsx` (right sidebar) |
| Federated remote registry | `packages/shell/src/moduleRegistry.js` |
| Host federation setup | `packages/shell/vite.config.js` |
| Remote federation setup | `packages/<module>/vite.config.js` |
| Flag-gated features  | `packages/<module>/src/Module.jsx` |

## Extending

- **Add a tenant:** add an entry to `tenants.json`. No code change.
- **Add a module:** scaffold a new package like the others, register it in `moduleRegistry.js` and the host `remotes` map, then list it in a tenant's `modules`.
- **Real flag backend:** swap the `fetch('/config/tenants.json')` in `App.jsx` for an API/LaunchDarkly call — the rest of the app is unchanged.
# multitenant_arch-poc
