'use client';

import { ReactNode, Component, useEffect, ErrorInfo } from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

interface MonitoringClientWrapperProps {
  children: ReactNode;
}

// 错误边界组件状态
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// 错误边界组件
class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // 报告给 Sentry
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24'
        }}>
          <h2>出错了</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>查看详情</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function MonitoringClientWrapper({ children }: MonitoringClientWrapperProps) {
  // 在客户端初始化 Sentry
  useEffect(() => {
    // 初始化 Sentry
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '', // 你的 Sentry DSN
      environment: process.env.NODE_ENV || 'development',
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1, // 降低采样率以节省 Sentry 免费配额
      debug: process.env.NODE_ENV !== 'production',
      
      // 设置默认标签
      beforeSend: (event: Sentry.Event) => {
        if (event.tags) {
          event.tags['app'] = 'web-frontend';
        } else {
          event.tags = { app: 'web-frontend' };
        }
        return event;
      },
      
      // 忽略一些常见的无关紧要错误
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        /^Network request failed/i,
        /^Loading chunk \d+ failed/i,
      ],
    });

    // 添加基本的上下文信息
    Sentry.setTags({
      'browser': getBrowserInfo(),
      'os': getOSInfo(),
    });
  }, []);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

/**
 * 获取浏览器信息
 */
function getBrowserInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    browser = 'Chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browser = 'IE';
  } else if (userAgent.indexOf('Edge') > -1) {
    browser = 'Edge';
  }
  
  return browser;
}

/**
 * 获取操作系统信息
 */
function getOSInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  let os = 'unknown';
  
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'MacOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    os = 'iOS';
  }
  
  return os;
} 