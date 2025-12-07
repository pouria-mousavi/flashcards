import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
            padding: '20px', 
            color: '#fff', 
            background: '#991b1b', 
            height: '100vh', 
            overflow: 'auto',
            fontFamily: 'monospace' 
        }}>
          <h1>Something went wrong.</h1>
          <h2 style={{ fontSize: '1.2rem', marginTop: '20px' }}>{this.state.error?.toString()}</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', background: 'rgba(0,0,0,0.3)', padding: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#fff',
                color: '#991b1b',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
