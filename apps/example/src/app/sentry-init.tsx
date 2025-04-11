"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/react";

export function SentryInitializer() {
  useEffect(() => {
    // 在客户端组件的 useEffect 中初始化 Sentry
    Sentry.init({
      dsn: "https://6ea7f94951bc4dac12d90a30ee77bf0b@o4509111158374400.ingest.us.sentry.io/4509132142346240",
      // 只保留基本错误捕获功能的最小配置
      environment: process.env.NODE_ENV,
      debug: true, // 开启调试模式，便于在控制台查看 Sentry 工作情况
    });
    
    console.log("Sentry initialized with basic error tracking");
  }, []);

  return null; // 这个组件不渲染任何内容
} 