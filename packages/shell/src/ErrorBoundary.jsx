import React from 'react'

// Isolates a remote MFE: if one module fails to load, the rest of the app survives.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, border: '1px dashed #ef4444', borderRadius: 12, background: '#fef2f2', color: '#991b1b' }}>
          <strong>Failed to load module “{this.props.name}”.</strong>
          <p style={{ margin: '8px 0 0' }}>
            Is its remote dev/preview server running? ({String(this.state.error?.message || this.state.error)})
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
