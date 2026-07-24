import React from 'react'
import ReactDOM from 'react-dom/client'
import Module from './Module.jsx'

const mockTenant = { id: 'dev', name: 'Standalone Dev', theme: { primary: '#db2777' } }
const mockFlags = { 'settings.betaSecurityPanel': true, 'settings.apiKeys': true }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Module tenant={mockTenant} flags={mockFlags} />
  </React.StrictMode>
)
