import { lazy } from 'react'

// Registry of federated remotes. Specifiers are static literals so the
// federation plugin can resolve them. The shell only mounts entries that
// the active tenant's config lists in `modules`.
export const MODULE_REGISTRY = {
  dashboard: {
    label: 'Dashboard',
    icon: '📊',
    load: lazy(() => import('dashboard/Module'))
  },
  analytics: {
    label: 'Analytics',
    icon: '📈',
    load: lazy(() => import('analytics/Module'))
  },
  settings: {
    label: 'Settings',
    icon: '⚙️',
    load: lazy(() => import('settings/Module'))
  }
}
