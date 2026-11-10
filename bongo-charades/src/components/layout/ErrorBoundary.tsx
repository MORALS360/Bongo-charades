import { Component, type ErrorInfo, type ReactNode } from 'react'
import { PrimaryButton } from '../ui/PrimaryButton'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string | null
}

/**
 * Application-level Error Boundary styled with the Bongo Charades visual identity.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Bongo Charades ErrorBoundary]', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell-outer">
          <div className="app-shell-portrait">
            <div
              className="app-shell-portrait__content"
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              <h1 className="text-hero-title">Pole sana!</h1>
              <p style={{ fontWeight: 700, margin: '8px 0 16px' }}>
                Something went wrong while rendering this screen.
              </p>
              {this.state.errorMessage && (
                <div
                  className="pl"
                  style={{
                    fontSize: 13,
                    fontFamily: 'ui-monospace, monospace',
                    marginBottom: 16,
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.errorMessage}
                </div>
              )}
              <PrimaryButton onClick={this.handleReset}>Try Again</PrimaryButton>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
