# 前端监控系统

这是一个基于 Sentry 构建的轻量级前端监控系统，专注于错误捕获和性能监控，优化了 Sentry 免费方案的使用。

## 项目结构

```
.
└── apps/                      # 应用程序
    ├── server/                # 后端服务 (Nest.js)
    ├── web/                   # 前端 Web 应用 (Next.js)
    │   └── app/               # Next.js App 目录
    │       ├── layout.tsx     # 应用布局
    │       └── page.tsx       # 主页面
    └── example/               # 示例应用
```

## 技术栈

- **前端**: Next.js, React
- **后端**: Nest.js
- **监控**: Sentry
- **构建工具**: Turborepo, pnpm
- **语言**: TypeScript

## 监控系统设计

我们的监控系统直接使用 Sentry SDK，专注于在 Sentry 免费方案的限制下提供最大价值：

- **错误捕获**: 自动捕获未处理的异常和错误
- **性能监控**: 跟踪关键性能指标
- **低采样率**: 默认 10% 采样率以节省 Sentry 配额
- **错误过滤**: 忽略常见的无关紧要错误

## 快速开始

1. 安装依赖 (为每个应用单独安装):
   ```bash
   cd apps/web && pnpm install --ignore-workspace
   cd ../server && pnpm install --ignore-workspace
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
import { ErrorBoundary } from '@sentry/react';

function App() {
  return (
    <ErrorBoundary fallback={<p>出错了</p>}>
      <YourApp />
    </ErrorBoundary>
  );
}
```