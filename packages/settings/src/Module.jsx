import React from 'react'

export default function Module({ tenant = {}, flags = {} }) {
  const primary = tenant.theme?.primary || '#db2777'
  const has = (key) => !!flags[key]

  const card = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    background: '#fff'
  }
  const row = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, color: primary }}>Settings</h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Configuration for {tenant.name} ({tenant.plan} plan)</p>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>General</h3>
        <div style={row}><span>Organization name</span><strong>{tenant.name}</strong></div>
        <div style={row}><span>Plan</span><strong>{tenant.plan}</strong></div>
        <div style={{ ...row, borderBottom: 0 }}><span>Tenant ID</span><code>{tenant.id}</code></div>
      </div>

      {has('settings.apiKeys') && (
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>API Keys</h3>
          <code style={{ display: 'block', background: '#f9fafb', padding: 10, borderRadius: 8 }}>
            sk_live_••••••••••••{tenant.id}
          </code>
        </div>
      )}

      {has('settings.betaSecurityPanel') && (
        <div style={{ ...card, borderColor: primary }}>
          <h3 style={{ marginTop: 0, color: primary }}>Security</h3>
          <div style={row}><span>Two-factor auth</span><strong>Enabled</strong></div>
          <div style={{ ...row, borderBottom: 0 }}><span>SSO / SAML</span><strong>Configured</strong></div>
        </div>
      )}
    </div>
  )
}
