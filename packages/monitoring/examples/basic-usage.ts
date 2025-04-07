/**
 * 基础使用示例
 * 展示如何初始化和使用精简版监控系统
 */

import { 
  initMonitoring, 
  captureException, 
  captureMessage,
  setUser,
  setTag,
  monitorPerformance
} from '@monitoring/monitoring';

// 1. 初始化监控系统
function setupMonitoring() {
  initMonitoring({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',  // 替换为您的 Sentry DSN
    environment: process.env.NODE_ENV || 'development',
    release: '1.0.0',
    sampleRate: 0.1,  // 仅发送 10% 的性能事件
    enablePerformance: true,
    debug: process.env.NODE_ENV !== 'production',
    tags: {
      app: 'example-app'
    },
    // 忽略一些常见的无关紧要错误
    ignoreErrors: [
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      /^Script error\.?$/,
      /^.*i18n is not defined.*$/,
    ],
  });

  // 为所有错误添加环境信息
  setTag('stage', process.env.STAGE || 'development');
  
  console.log('监控系统已初始化');
}

// 2. 设置用户信息
function identifyUser(userId: string, email?: string) {
  setUser({
    id: userId,
    email: email,
  });
  
  console.log(`已标识用户: ${userId}`);
}

// 3. 手动捕获错误示例
function handleError(error: Error) {
  // 添加上下文信息
  captureException(error, {
    tags: {
      feature: 'payment',
      action: 'checkout'
    }
  });
  
  console.error('已捕获错误:', error.message);
}

// 4. 发送自定义消息
function logImportantEvent(message: string) {
  captureMessage(message, {
    level: 'info',
  });
  
  console.log(`已记录事件: ${message}`);
}

// 5. 性能监控示例
function measurePerformance() {
  monitorPerformance.mark('data-fetch-start');
  
  // 模拟数据获取操作
  setTimeout(() => {
    monitorPerformance.mark('data-fetch-end');
    monitorPerformance.measure(
      'data-fetch-duration',
      'data-fetch-start',
      'data-fetch-end'
    );
    
    console.log('已测量性能指标: data-fetch-duration');
  }, 1000);
}

// 6. 模拟一个错误
function simulateError() {
  try {
    // 这将导致一个错误
    const obj = {} as any;
    console.log(obj.nonExistentMethod());
  } catch (error) {
    if (error instanceof Error) {
      handleError(error);
    }
  }
}

// 使用示例
export function runExample() {
  setupMonitoring();
  identifyUser('user-123', 'user@example.com');
  logImportantEvent('用户开始结账流程');
  measurePerformance();
  
  // 延迟 2 秒后模拟一个错误
  setTimeout(simulateError, 2000);
}

// 如果直接运行此文件
if (typeof window !== 'undefined') {
  runExample();
} 