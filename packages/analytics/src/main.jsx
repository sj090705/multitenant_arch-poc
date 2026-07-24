import React from 'react'
import ReactDOM from 'react-dom/client'
import Module from './Module.jsx'

const mockTenant = { id: 'dev', name: 'Standalone Dev', theme: { primary: '#16a34a' } }
const mockFlags = { 'analytics.csvExport': true, 'analytics.realtime': true }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Module tenant={mockTenant} flags={mockFlags} />
  </React.StrictMode>
)
