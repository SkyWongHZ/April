# 前端监控系统

这是一个基于 Sentry 构建的轻量级前端监控系统，专注于错误捕获和性能监控，优化了 Sentry 免费方案的使用。

## 项目结构

```
.
├── apps/                      # 应用程序
│   ├── api/                   # 后端 API 服务
│   └── web/                   # 前端 Web 应用
│       └── app/               # Next.js App 目录
│           ├── MonitoringClientWrapper.tsx  # 前端监控集成
│           ├── layout.tsx     # 应用布局
│           └── page.tsx       # 主页面
│
├── packages/                  # 共享包
│   ├── monitoring/            # 监控系统核心包
│   │   ├── src/               # 源代码
│   │   │   ├── index.ts       # 主入口
│   │   │   └── react.tsx      # React 集成
│   │   └── examples/          # 使用示例
│   ├── types/                 # 共享类型定义
│   └── ui/                    # UI 组件库
│
└── docs/                      # 文档
    └── monitoring-implementation.md  # 监控实现说明
```

## 技术栈

- **前端**: Next.js, React
- **监控**: Sentry
- **构建工具**: Turborepo, pnpm
- **语言**: TypeScript

## 监控系统设计

我们的监控系统是一个轻量级的封装，专注于在 Sentry 免费方案的限制下提供最大价值：

- **错误捕获**: 自动捕获未处理的异常和错误
- **性能监控**: 跟踪关键性能指标
- **低采样率**: 默认 10% 采样率以节省 Sentry 配额
- **错误过滤**: 忽略常见的无关紧要错误

## 快速开始

1. 安装依赖:
   ```bash
   pnpm install
   ```

2. 开发模式:
   ```bash
   pnpm dev
   ```

3. 构建项目:
   ```bash
   pnpm build
   ```

## 使用监控系统

在任何 React 应用中使用:

```tsx
import { MonitoringProvider } from '@monitoring/monitoring/react';

function App() {
  return (
    <MonitoringProvider
      options={{
        dsn: 'YOUR_SENTRY_DSN',
        environment: 'production',
        sampleRate: 0.1
      }}
    >
      <YourApp />
    </MonitoringProvider>
  );
}
```

详细文档请参考 [docs/monitoring-implementation.md](docs/monitoring-implementation.md)。