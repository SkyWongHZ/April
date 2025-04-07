import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

/**
 * 精简版监控系统配置选项
 */
export interface MonitoringOptions {
  dsn: string;
  environment: string;
  release?: string;
  sampleRate?: number;
  enablePerformance?: boolean;
  debug?: boolean;
  ignoreErrors?: Array<string | RegExp>;
  tags?: Record<string, string>;
  beforeSend?: (event: Sentry.Event, hint?: Sentry.EventHint) => Sentry.Event | null;
}

/**
 * 初始化精简版监控系统
 * 专注于错误捕获和基础性能监控
 */
export function initMonitoring(options: MonitoringOptions): void {
  const {
    dsn,
    environment,
    release,
    sampleRate = 0.1, // 降低采样率以节省免费配额
    enablePerformance = true,
    debug = false,
    ignoreErrors = [],
    tags = {},
    beforeSend,
  } = options;

  const integrations = [];
  
  // 仅在需要时添加性能监控
  if (enablePerformance) {
    integrations.push(new BrowserTracing());
  }

  Sentry.init({
    dsn,
    environment,
    release,
    integrations,
    tracesSampleRate: sampleRate,
    debug,
    ignoreErrors,
    
    // 设置默认标签
    beforeSend: (event, hint) => {
      // 添加通用标签
      Object.entries(tags).forEach(([key, value]) => {
        event.tags = event.tags || {};
        event.tags[key] = value;
      });
      
      // 应用自定义的 beforeSend 处理（如果提供）
      if (beforeSend) {
        return beforeSend(event, hint);
      }
      
      return event;
    }
  });
  
  // 添加一些基本的上下文信息
  Sentry.setTags({
    'app.version': release || 'unknown',
    'browser': getBrowserInfo(),
    'os': getOSInfo(),
  });
}

/**
 * 获取浏览器信息
 */
function getBrowserInfo(): string {
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

// 重新导出 Sentry 核心功能，这样用户可以直接从监控包中导入
export { 
  captureException,
  captureMessage,
  setUser,
  setTag,
  setTags,
  setExtra,
  startTransaction,
  configureScope,
  withScope
} from '@sentry/browser';

// 简单性能标记工具
export const monitorPerformance = {
  mark: (name: string): void => {
    try {
      window.performance.mark(name);
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Performance mark: ${name}`,
        level: 'info'
      });
    } catch (e) {
      console.error('Failed to add performance mark', e);
    }
  },
  
  measure: (name: string, startMark: string, endMark: string): void => {
    try {
      const measurement = window.performance.measure(name, startMark, endMark);
      // 安全地获取持续时间
      const duration = measurement ? 
        (typeof measurement.duration === 'number' ? measurement.duration : undefined) :
        undefined;
      
      if (duration !== undefined) {
        Sentry.setTag(`performance.${name}`, duration.toString());
      }
    } catch (e) {
      console.error('Failed to measure performance', e);
    }
  }
};
