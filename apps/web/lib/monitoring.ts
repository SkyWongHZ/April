/**
 * 监控系统助手函数
 * 
 * 该文件包含了一些辅助函数，用于使用 @monitoring/monitoring 包
 * 我们在这里处理导入，避免 Next.js 应用中的导入问题
 */

// 标准的导入方式，用于非 React 相关功能
import { 
  initMonitoring,
  captureException, 
  captureMessage,
  setUser,
  setTag,
  monitorPerformance
} from '@monitoring/monitoring';

// 导出所有非 React 相关功能
export {
  initMonitoring,
  captureException,
  captureMessage,
  setUser,
  setTag,
  monitorPerformance
};

// React 相关组件将在 MonitoringClientWrapper.tsx 中处理 