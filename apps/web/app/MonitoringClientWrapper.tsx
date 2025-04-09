'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 使用 any 类型来避免类型检查错误
// @ts-ignore - 忽略模块导入错误
const MonitoringProviderImport = dynamic(
  () => import('@monitoring/monitoring/react').then((mod: any) => ({ 
    default: mod.MonitoringProvider 
  })),
  { 
    ssr: false,
    loading: () => <>{/* 加载中不显示任何内容 */}</> 
  }
) as any; // 使用 any 类型避免类型错误

/**
 * 监控客户端包装器组件
 * 
 * 使用 packages/monitoring 包提供的精简版监控系统，该系统专注于：
 * 1. 错误捕获和基本性能监控
 * 2. 降低采样率，节省 Sentry 免费配额
 * 3. 过滤非关键错误
 * 
 * 注意：如需了解更多信息，请参考 docs/monitoring-implementation.md
 */
interface MonitoringClientWrapperProps {
  children: ReactNode;
}

export default function MonitoringClientWrapper({ children }: MonitoringClientWrapperProps) {
  // 只在客户端渲染此组件
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <>{children}</>;
  }
  
  return (
    <MonitoringProviderImport
      options={{
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '', // Sentry DSN
        environment: process.env.NODE_ENV || 'development',
        release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        sampleRate: 0.1, // 降低采样率以节省 Sentry 免费配额
        enablePerformance: true, // 启用性能监控
        debug: process.env.NODE_ENV !== 'production',
        tags: {
          app: 'web-frontend',
        },
        // 忽略一些常见的无关紧要错误
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          /^Network request failed/i,
          /^Loading chunk \d+ failed/i,
        ],
      }}
    >
      {children}
    </MonitoringProviderImport>
  );
} 