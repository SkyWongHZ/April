import React, { Component, useEffect, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { initMonitoring, MonitoringOptions } from './index';

/**
 * 错误边界组件属性
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, componentStack: string) => ReactNode);
  onError?: (error: Error, componentStack: string) => void;
}

/**
 * 错误边界组件状态
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  componentStack?: string;
}

/**
 * React 错误边界组件
 * 捕获子组件中的错误并提供错误展示界面
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 更新组件堆栈信息
    this.setState({ componentStack: info.componentStack });

    // 调用用户自定义的错误处理函数
    if (this.props.onError) {
      this.props.onError(error, info.componentStack);
    }

    // 报告给 Sentry
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', info.componentStack || '');
      Sentry.captureException(error);
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function' && this.state.error && this.state.componentStack) {
          // 使用类型断言确保返回类型正确
          return this.props.fallback(this.state.error, this.state.componentStack) as ReactNode;
        }
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div style={{
          padding: '20px',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show Details</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 监控提供者组件属性
 */
interface MonitoringProviderProps {
  children: ReactNode;
  options: MonitoringOptions;
}

/**
 * 精简版监控提供者组件
 * 在应用顶层初始化监控并提供错误边界
 */
export const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
  options
}) => {
  useEffect(() => {
    // 初始化监控
    initMonitoring(options);
  }, []);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

/**
 * 类组件错误报告包装器
 * @param Component 要包装的组件
 * @returns 包装后的组件
 */
export function withErrorReporting<P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props: P) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorReporting(${displayName})`;
  return WrappedComponent;
} 