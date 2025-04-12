/**
 * 监控系统助手函数
 * 
 * 该文件包含了一些辅助函数，用于与 Sentry 进行交互
 * 直接使用 Sentry SDK，不再依赖 @monitoring/monitoring 包
 */

// 使用 Sentry 替代 @monitoring/monitoring
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// 初始化监控
export const initMonitoring = (dsn: string, environment: string = 'development') => {
  Sentry.init({
    dsn,
    environment,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
};

// 导出 Sentry 的基本功能
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;

// 设置标签
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// 性能监控
export const monitorPerformance = (name: string, callback: () => any) => {
  const transaction = Sentry.startTransaction({ name });
  try {
    return callback();
  } finally {
    transaction.finish();
  }
};

// React 相关组件仍然可以直接从 @sentry/react 导入 