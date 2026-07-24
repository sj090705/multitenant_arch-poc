import React from 'react'

export default function Module({ tenant = {}, flags = {} }) {
  const primary = tenant.theme?.primary || '#16a34a'
  const has = (key) => !!flags[key]

  const card = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    background: '#fff'
  }

  const bars = [40, 65, 52, 80, 72, 90, 60]

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, color: primary }}>Analytics</h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Traffic & conversion for {tenant.name}</p>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Weekly Sessions</h3>
          {has('analytics.realtime') && (
            <span style={{ fontSize: 12, color: '#fff', background: primary, padding: '2px 8px', borderRadius: 999 }}>
              ● live
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginTop: 16 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: primary, borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
          ))}
        </div>
      </div>

      {has('analytics.csvExport') && (
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Export</h3>
          <button style={{ background: primary, color: '#fff', border: 0, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
            Download CSV
          </button>
        </div>
      )}
    </div>
  )
}
