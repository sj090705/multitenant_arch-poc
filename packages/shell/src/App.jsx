import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { MODULE_REGISTRY } from './moduleRegistry.js'
import ErrorBoundary from './ErrorBoundary.jsx'

const params = () => new URLSearchParams(window.location.search)
const readTenantFromUrl = () => params().get('tenant') || 'abc'
const readModeFromUrl = () => (params().get('mode') === 'admin' ? 'admin' : 'user')

export default function App() {
  const [config, setConfig] = useState(null)       // full tenants.json
  const [tenantId, setTenantId] = useState(readTenantFromUrl())
  const [mode, setMode] = useState(readModeFromUrl()) // 'user' | 'admin'
  const [overrides, setOverrides] = useState({})    // live flag overrides (admin only)
  const [active, setActive] = useState(null)         // currently viewed module id

  // Runtime config load — this is the "local JSON config" source.
  useEffect(() => {
    fetch('/config/tenants.json')
      .then((r) => r.json())
      .then(setConfig)
      .catch((e) => console.error('Failed to load tenant config', e))
  }, [])

  const tenant = config?.[tenantId]

  // Effective flags = tenant defaults merged with any live admin overrides.
  const flags = useMemo(() => ({ ...(tenant?.flags || {}), ...overrides }), [tenant, overrides])

  // Modules this tenant is entitled to, filtered to ones the shell knows about.
  const enabledModules = useMemo(
    () => (tenant?.modules || []).filter((m) => MODULE_REGISTRY[m]),
    [tenant]
  )

  // Default the view to the first enabled module whenever tenant changes.
  useEffect(() => {
    if (enabledModules.length) setActive(enabledModules[0])
  }, [tenantId, config]) // eslint-disable-line

  const syncUrl = (key, value) => {
    const url = new URL(window.location)
    url.searchParams.set(key, value)
    window.history.replaceState({}, '', url)
  }

  const switchTenant = (id) => {
    setOverrides({})
    setTenantId(id)
    syncUrl('tenant', id)
  }

  const switchMode = (m) => {
    if (m !== 'admin') setOverrides({})
    setMode(m)
    syncUrl('mode', m)
  }

  if (!config) return <div style={{ padding: 40 }}>Loading tenant configuration…</div>
  if (!tenant) return <div style={{ padding: 40 }}>Unknown tenant “{tenantId}”.</div>

  const primary = tenant.theme.primary
  const isAdmin = mode === 'admin'
  const ActiveModule = active ? MODULE_REGISTRY[active].load : null

  // Only flags belonging to the module currently being viewed.
  const moduleFlagKeys = Object.keys(tenant.flags).filter((k) => k.startsWith(`${active}.`))

  const selectStyle = { padding: '6px 10px', borderRadius: 8, border: 0 }
  const gridCols = isAdmin ? '220px 1fr 300px' : '220px 1fr'

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top bar — themed per tenant */}
      <header style={{ background: primary, color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 22 }}>{tenant.theme.logo}</span>
        <strong style={{ fontSize: 18 }}>{tenant.name}</strong>
        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 999 }}>
          {tenant.plan}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, opacity: 0.9 }}>Tenant</label>
            <select value={tenantId} onChange={(e) => switchTenant(e.target.value)} style={selectStyle}>
              {Object.values(config).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, opacity: 0.9 }}>Mode</label>
            <select value={mode} onChange={(e) => switchMode(e.target.value)} style={selectStyle}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 0, alignItems: 'start' }}>
        {/* Nav — built from the tenant's enabled modules */}
        <nav style={{ padding: 16, borderRight: '1px solid #e5e7eb', minHeight: 'calc(100vh - 52px)' }}>
          {enabledModules.map((id) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: 'flex', gap: 10, width: '100%', textAlign: 'left',
                padding: '10px 12px', marginBottom: 6, borderRadius: 8, cursor: 'pointer',
                border: 0,
                background: active === id ? primary : 'transparent',
                color: active === id ? '#fff' : '#374151',
                fontSize: 14
              }}
            >
              <span>{MODULE_REGISTRY[id].icon}</span>
              {MODULE_REGISTRY[id].label}
            </button>
          ))}
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 20 }}>
            {enabledModules.length} of {Object.keys(MODULE_REGISTRY).length} modules enabled for this tenant.
          </p>
        </nav>

        {/* Federated module mounts here */}
        <main style={{ padding: 24 }}>
          {ActiveModule ? (
            <ErrorBoundary name={active} resetKey={tenantId}>
              <Suspense fallback={<div>Loading {active} module…</div>}>
                <ActiveModule tenant={tenant} flags={flags} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <div>No modules enabled for this tenant.</div>
          )}
        </main>

        {/* Live feature-flag playground — ADMIN MODE ONLY, scoped to active module */}
        {isAdmin && (
          <aside style={{ padding: 16, borderLeft: '1px solid #e5e7eb', minHeight: 'calc(100vh - 52px)', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Feature flags</h4>
              <span style={{ fontSize: 11, color: '#fff', background: primary, padding: '2px 8px', borderRadius: 999 }}>admin</span>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              Flags for the <strong>{MODULE_REGISTRY[active]?.label}</strong> module.
              Defaults come from <code>tenants.json</code>; toggle to preview.
            </p>
            {moduleFlagKeys.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9ca3af' }}>No flags defined for this module.</p>
            ) : (
              moduleFlagKeys.map((key) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    checked={!!flags[key]}
                    onChange={(e) => setOverrides((o) => ({ ...o, [key]: e.target.checked }))}
                  />
                  <code style={{ fontSize: 12 }}>{key}</code>
                </label>
              ))
            )}
            {Object.keys(overrides).length > 0 && (
              <button
                onClick={() => setOverrides({})}
                style={{ marginTop: 12, fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
              >
                Reset to tenant defaults
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
