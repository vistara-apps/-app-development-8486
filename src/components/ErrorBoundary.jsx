import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to a logging service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="error-content">
              <h2>🚨 Something went wrong</h2>
              <p>We encountered an unexpected error. Please try refreshing the page.</p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="error-details">
                  <summary>Error Details (Development Mode)</summary>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
              
              <div className="error-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
