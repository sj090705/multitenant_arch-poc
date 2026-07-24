import React from 'react'
import ReactDOM from 'react-dom/client'
import Module from './Module.jsx'

// Standalone dev harness: lets you run this MFE on its own with mock props.
const mockTenant = { id: 'dev', name: 'Standalone Dev', theme: { primary: '#2563eb' } }
const mockFlags = { 'dashboard.revenueWidget': true, 'dashboard.activityFeed': true }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Module tenant={mockTenant} flags={mockFlags} />
  </React.StrictMode>
)
