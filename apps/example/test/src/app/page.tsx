"use client";

import { useState, useEffect } from "react";
import { sentryCollector } from "./sentry-config";
import { ErrorTest, ErrorFallback } from "./components/ErrorTest";
// 直接导入Sentry的ErrorBoundary来修复类型问题
import { ErrorBoundary } from "@sentry/react";

// 辅助函数 - 获取北京时间的格式化字符串
function getBeiJingTime(): string {
  const now = new Date();
  // 转换为北京时间 (UTC+8)
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijingTime.toISOString().replace('Z', '+08:00');
}

export default function Home() {
  const [errorStatus, setErrorStatus] = useState<"none" | "sending" | "sent" | "failed">("none");
  const [collectorInitialized, setCollectorInitialized] = useState(false);
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);
  
  // 初始化SentryCollector
  useEffect(() => {
    try {
      sentryCollector.init();
      console.log("SentryCollector 已初始化");
      setCollectorInitialized(true);
      
      // 设置一些测试标签和上下文
      sentryCollector.setTag("page", "home");
      sentryCollector.setContext("app_info", {
        version: "1.0.0",
        buildTime: getBeiJingTime()
      });
      
      // 设置用户信息示例
      sentryCollector.setUser({
        id: "test-user-123",
        username: "测试用户",
        email: "test@example.com",
        role: "tester"
      });
    } catch (error) {
      console.error("SentryCollector 初始化失败:", error);
    }
  }, []);

  // 通过SentryCollector捕获错误
  const handleCollectorError = () => {
    try {
      setErrorStatus("sending");
      // 故意制造一个错误
      throw new Error("SentryCollector Test Error " + getBeiJingTime());
    } catch (error) {
      if (error instanceof Error) {
        console.log("通过SentryCollector捕获错误:", error.message);
        
        // 使用SentryCollector捕获错误
        sentryCollector.captureError(error, {
          context: {
            timestamp: getBeiJingTime(),
            component: "Home",
            action: "测试错误捕获"
          },
          tags: {
            errorType: "test_error",
            severity: "medium"
          }
        });
        
        setErrorStatus("sent");
        setTimeout(() => setErrorStatus("none"), 3000);
      }
    }
  };

  // 发送一个消息事件
  const sendMessage = () => {
    if (!collectorInitialized) return;
    
    setErrorStatus("sending");
    // 创建一个测试消息
    const message = "这是一个通过SentryCollector发送的测试消息 " + getBeiJingTime();
    
    try {
      // 使用SentryCollector捕获消息
      sentryCollector.captureError(message, {
        context: {
          timestamp: getBeiJingTime(),
          component: "Home",
          action: "发送测试消息"
        },
        tags: {
          messageType: "test_message",
          severity: "info"
        }
      });
      
      console.log("消息已发送:", message);
      setErrorStatus("sent");
      setTimeout(() => setErrorStatus("none"), 3000);
    } catch (err) {
      console.error("发送消息失败:", err);
      setErrorStatus("failed");
      setTimeout(() => setErrorStatus("none"), 3000);
    }
  };

  // 显示/隐藏ErrorBoundary测试组件
  const toggleErrorBoundary = () => {
    setShowErrorBoundary(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Sentry-Collector 测试页面</h1>
      <p className="mb-4">使用 sentry-collector 库进行错误收集与验证</p>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="p-3 bg-gray-100 rounded">
          <h2 className="font-bold text-xl mb-2">SentryCollector 状态</h2>
          <p>初始化状态: {collectorInitialized ? "✅ 已初始化" : "❌ 未初始化"}</p>
          <p className="text-sm text-gray-500 mt-1">当前时间: {getBeiJingTime()}</p>
        </div>
        
        <button 
          onClick={handleCollectorError}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 transition-colors"
          disabled={errorStatus === "sending" || !collectorInitialized}
        >
          使用 SentryCollector 发送错误
        </button>
        
        <button 
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
          disabled={errorStatus === "sending" || !collectorInitialized}
        >
          发送信息事件
        </button>
        
        <button 
          onClick={toggleErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showErrorBoundary ? "隐藏" : "显示"} ErrorBoundary 测试组件
        </button>
        
        {showErrorBoundary && (
          <div className="mt-4">
            {collectorInitialized && (
              <ErrorBoundary
                fallback={(props) => (
                  <ErrorFallback 
                    error={props.error as Error} 
                    resetError={props.resetError} 
                  />
                )}
                onError={(error) => {
                  console.log("ErrorBoundary捕获到错误:", error);
                  console.log("错误已被ErrorBoundary自动记录到Sentry");
                }}
              >
                <ErrorTest />
              </ErrorBoundary>
            )}
          </div>
        )}
        
        {errorStatus === "sending" && (
          <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            发送数据到 Sentry...
          </div>
        )}
        
        {errorStatus === "sent" && (
          <div className="p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            数据已发送到 Sentry！
          </div>
        )}
        
        {errorStatus === "failed" && (
          <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            发送失败，请检查控制台
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded max-w-md w-full">
        <h2 className="font-bold mb-2">调试提示：</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>查看浏览器控制台中的 SentryCollector 日志</li>
          <li>检查网络面板中是否有对 sentry.io 的请求</li>
          <li>在Sentry控制台中查看捕获的错误和消息</li>
          <li>注意错误上报中额外添加的上下文和标签</li>
          <li>确保没有广告拦截器阻止 Sentry 请求</li>
        </ul>
      </div>
    </div>  
  );
}
