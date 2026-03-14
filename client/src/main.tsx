import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// Lazy import App to catch any module-level errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'red', background: '#fff1f1' }}>
          <h2>Render Error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          <pre style={{ fontSize: '11px', color: '#666', whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 0 } } })

const App = React.lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div style={{padding:'2rem'}}>Loading...</div>}>
        <App />
      </React.Suspense>
    </QueryClientProvider>
  </ErrorBoundary>
)
