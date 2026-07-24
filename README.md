# Multitenant Micro-Frontend POC

Runtime-composed micro-frontends with **per-tenant configuration** and **feature flags**, built on **Vite + Module Federation** and **React**.

> **This is a deliberately small proof of a pattern that is built to scale.** It runs as 3 modules and 3 tenants on one laptop, but the exact same architecture supports dozens of independently-deployed modules owned by separate teams, and hundreds of tenants — **without changing the shell or touching existing modules.** The whole point of the POC is that growth is additive: you add a config row or a new remote, never rewrite the core. See [From POC to production scale](#from-poc-to-production-scale).

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

## From POC to production scale

This POC is intentionally minimal, but the architecture is the same one large multi-team platforms use. Scaling it up is **additive, not a rewrite** — each axis below grows independently.

### The three axes of growth

| Axis | POC today | Production scale | What changes |
|------|-----------|------------------|--------------|
| **Modules** | 3 | Dozens, owned by different teams | Add a remote + one registry line. Existing modules untouched. |
| **Tenants** | 3 (local JSON) | Hundreds/thousands | Config moves from a static file to an entitlement API. No UI change. |
| **Teams** | 1 | Many, deploying independently | Each module gets its own repo, CI, and release cadence. |

### Why growth stays cheap

- **Modules deploy independently.** Each module is its own build artifact loaded at runtime via `remoteEntry.js`. Shipping a fix to `analytics` means redeploying *only* `analytics` — the shell and the other modules keep running the version they already loaded. No coordinated "big bang" release, no full-app rebuild.
- **Teams own vertical slices.** Because a module is a standalone app behind a small props contract (`{ tenant, flags }`), a team can own it end-to-end — repo, pipeline, on-call — without reading or breaking anyone else's code. This is the property that lets a frontend org scale past a single team without the codebase turning into a bottleneck.
- **Onboarding a tenant is data, not code.** A new tenant is a config entry: theme, entitled modules, flags. In the POC that's a row in `tenants.json`; in production it's a record served by an API. Onboarding the 500th tenant costs the same as the 3rd — zero engineering time.
- **Features roll out by flag, not by deploy.** Shipping the code and enabling it are decoupled. You can dark-launch a widget to one tenant, canary it, or instantly roll it back by flipping a flag — no redeploy, no revert PR.
- **The shell never grows with the system.** The host stays a thin composition layer: load config, theme, mount entitled modules, pass props. Adding the 40th module doesn't make the shell more complex, because the shell doesn't *know* about individual modules — it only knows the registry and the contract.

### The one line that makes it scale

Everything hinges on the module contract being tiny and stable:

```jsx
<ActiveModule tenant={tenant} flags={flags} />
```

As long as new modules honor that contract, the shell composes any number of them without change. Keeping this contract stable (and versioned) is the single most important discipline as the system grows.

### What you'd harden on the way to production

The POC proves the composition model; a real deployment adds the boundaries a POC intentionally skips:

- **Entitlement + flags served and enforced server-side** (signed, not client-trusted) — see the notes on module gating below.
- **Auth-gated remotes** so a module's `remoteEntry.js` and its data APIs re-check entitlement.
- **Shared-dependency versioning** (React and design-system pinned/negotiated across remotes) to avoid duplicate or mismatched runtimes.
- **A module registry service** instead of a hardcoded host `remotes` map, so modules can be published and discovered dynamically.
- **Independent CI/CD per module**, versioned remote URLs, and observability per remote.

## Extending

- **Add a tenant:** add an entry to `tenants.json`. No code change.
- **Add a module:** scaffold a new package like the others, register it in `moduleRegistry.js` and the host `remotes` map, then list it in a tenant's `modules`.
- **Add a dashboard widget:** add an entry to the `WIDGETS` array in `packages/dashboard/src/Module.jsx` and a matching flag in `tenants.json`.
- **Real flag backend:** swap the `fetch('/config/tenants.json')` in `App.jsx` for an API/LaunchDarkly call — the rest of the app is unchanged.
