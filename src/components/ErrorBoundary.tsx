import React from 'react';

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, message: String(error?.message || error) };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Nunito Sans, sans-serif' }}>
          <h2 style={{ color: '#d32f2f' }}>Terjadi kesalahan saat memuat aplikasi</h2>
          <p style={{ color: '#555' }}>{this.state.message}</p>
          <p style={{ color: '#777' }}>Coba reload halaman (Ctrl+F5). Jika masih terjadi, kirim screenshot Console.</p>
        </div>
      );
    }
    return this.props.children as any;
  }
}


