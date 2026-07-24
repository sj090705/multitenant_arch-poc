import React from 'react'

// Widget catalog — config-driven. Add a widget by adding an entry here and
// (unless `fixed`) a matching flag in the tenant config. `fixed` widgets always
// render and ignore flags.
const WIDGETS = [
  { id: 'activeUsers', label: 'Active Users', value: '12,480', fixed: true },
  { id: 'revenue', label: 'Revenue (MTD)', value: '$284,120', flag: 'dashboard.revenueWidget' },
  { id: 'conversion', label: 'Conversion Rate', value: '3.8%', flag: 'dashboard.conversionWidget' },
  { id: 'tickets', label: 'Open Tickets', value: '27', flag: 'dashboard.ticketsWidget' },
  { id: 'signups', label: 'New Signups (7d)', value: '512', flag: 'dashboard.signupsWidget' },
  { id: 'churn', label: 'Churn Rate', value: '1.2%', flag: 'dashboard.churnWidget' }
]

export default function Module({ tenant = {}, flags = {} }) {
  const primary = tenant.theme?.primary || '#2563eb'
  const has = (key) => !!flags[key]

  const card = {
    width: 220,                 // fixed width — hiding a widget never elongates the others
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    boxSizing: 'border-box'
  }

  const visibleWidgets = WIDGETS.filter((w) => w.fixed || has(w.flag))

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, color: primary }}>Dashboard</h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Overview for {tenant.name}</p>
      </div>

      {/* Fixed-width tracks (not 1fr): cards keep their size regardless of how many show */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 220px)', gap: 16 }}>
        {visibleWidgets.map((w) => (
          <div key={w.id} style={card}>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{w.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{w.value}</div>
          </div>
        ))}
      </div>

      {has('dashboard.activityFeed') && (
        <div style={{ ...card, width: '100%' }}>
          <h3 style={{ marginTop: 0 }}>Activity Feed</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#374151' }}>
            <li>New user signed up</li>
            <li>Invoice #4021 paid</li>
            <li>Report exported</li>
          </ul>
        </div>
      )}
    </div>
  )
}
