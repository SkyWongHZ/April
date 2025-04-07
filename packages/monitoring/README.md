# @monitoring/monitoring

基于 Sentry 的轻量级前端监控系统，专注于核心错误捕获和性能监控功能。

## 功能

- **错误和异常捕获** (基于 Sentry 核心功能)
- **基础性能监控** (使用 Sentry 性能追踪)
- **React 集成** (错误边界和组件包装)

## 安装

```bash
# 在 monorepo 中可以直接使用 workspace 依赖
pnpm add @monitoring/monitoring@workspace:*
```

## 为什么是精简版？

此版本专注于 Sentry 免费方案下的核心功能，通过:

1. 降低事件采样率以控制配额使用
2. 去除高事件量的功能 (如详细用户行为跟踪)
3. 简化集成方式，减少实现复杂度

## 基本用法

### 初始化监控

```typescript
import { initMonitoring } from '@monitoring/monitoring';

initMonitoring({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
  release: '1.0.0',
  sampleRate: 0.1,           // 降低采样率以节省免费配额
  enablePerformance: true,   // 如果需要性能监控
  debug: false,
  tags: {                    // 默认标签
    app: 'your-app-name'
  }
});
```

### 手动捕获错误

```typescript
import { captureException, captureMessage } from '@monitoring/monitoring';

try {
  // 可能会抛出错误的代码
} catch (error) {
  captureException(error);
}

// 捕获自定义消息
captureMessage('Something happened', {
  level: 'warning'
});
```

### 用户标识

```typescript
import { setUser } from '@monitoring/monitoring';

// 设置用户信息
setUser({
  id: 'user123',
  email: 'user@example.com'
});
```

### 简单性能标记

```typescript
import { monitorPerformance } from '@monitoring/monitoring';

// 开始一个性能标记
monitorPerformance.mark('start-process');
// 执行某些操作...
monitorPerformance.mark('end-process');
// 测量两个标记之间的时间
monitorPerformance.measure('process-duration', 'start-process', 'end-process');
```

## React 集成

### 使用 MonitoringProvider 包装应用

```tsx
import { MonitoringProvider } from '@monitoring/monitoring/react';

function App() {
  return (
    <MonitoringProvider
      options={{
        dsn: 'YOUR_SENTRY_DSN',
        environment: process.env.NODE_ENV,
        sampleRate: 0.1,
        enablePerformance: true
      }}
    >
      <YourApp />
    </MonitoringProvider>
  );
}
```

### 使用错误边界

```tsx
import { ErrorBoundary } from '@monitoring/monitoring/react';

function MyComponent() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### 使用高阶组件包装

```tsx
import { withErrorReporting } from '@monitoring/monitoring/react';

class MyComponent extends React.Component {
  // ...
}

export default withErrorReporting(MyComponent);
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| dsn | string | 必填 | Sentry DSN |
| environment | string | 必填 | 环境名称 |
| release | string | undefined | 版本号 |
| sampleRate | number | 0.1 | 事件采样率 (0-1) |
| enablePerformance | boolean | true | 是否启用性能监控 |
| debug | boolean | false | 是否启用调试模式 |
| tags | object | {} | 默认标签 |
| ignoreErrors | array | [] | 要忽略的错误模式 |
| beforeSend | function | undefined | 发送前处理事件的函数 |

## 未来扩展方向

随着项目需求的增长，可以按需添加以下功能:

1. **用户行为追踪** - 当需要更详细的用户行为数据时
2. **资源加载监控** - 以识别大文件和慢加载问题
3. **网络请求跟踪** - 追踪 API 调用和网络问题
4. **自定义后端集成** - 当需要绕过 Sentry 限制时

## 关于 Sentry 免费方案

Sentry 免费方案有以下限制:

- 每月事件数量有限 (查看最新 Sentry 官方文档)
- 数据保留时间有限
- 团队成员数量限制

该精简版监控库设计用来在这些限制下提供最大的价值。