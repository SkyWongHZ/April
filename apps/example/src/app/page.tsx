"use client";

import * as Sentry from "@sentry/react";
import { useState } from "react";

export default function Home() {
  const [errorStatus, setErrorStatus] = useState<"none" | "sending" | "sent" | "failed">("none");

  const handleError = () => {
    try {
      setErrorStatus("sending");
      // 故意制造一个错误
      throw new Error("Test error for Sentry " + new Date().toISOString());
    } catch (error) {
      console.error("Capturing error with Sentry:", error);
      
      // 捕获错误并发送到 Sentry
      const eventId = Sentry.captureException(error);
      console.log("Sentry event ID:", eventId);
      
      setErrorStatus("sent");
      setTimeout(() => setErrorStatus("none"), 3000);
    }
  };

  // 测试未捕获的错误（这会直接被 Sentry 的全局处理器捕获）
  const triggerUncaughtError = () => {
    setErrorStatus("sending");
    // 使用 setTimeout 确保错误在事件循环的不同阶段发生
    setTimeout(() => {
      // 这将触发未捕获的错误
      throw new Error("Uncaught test error for Sentry " + new Date().toISOString());
    }, 100);
  };

  // 直接发送一个消息事件到 Sentry
  const sendMessage = () => {
    setErrorStatus("sending");
    // 发送一个简单的消息事件
    const eventId = Sentry.captureMessage("这是一个测试消息 " + new Date().toISOString(), "info");
    console.log("发送消息事件，ID:", eventId);
    setErrorStatus("sent");
    setTimeout(() => setErrorStatus("none"), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Sentry 测试页面</h1>
      <p className="mb-4">点击下方按钮测试 Sentry 错误捕获功能</p>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button 
          onClick={handleError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={errorStatus === "sending"}
        >
          测试捕获错误
        </button>
        
        <button 
          onClick={triggerUncaughtError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
          disabled={errorStatus === "sending"}
        >
          测试未捕获错误
        </button>
        
        <button 
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
          disabled={errorStatus === "sending"}
        >
          发送信息事件
        </button>
        
        {errorStatus === "sending" && (
          <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            发送错误到 Sentry...
          </div>
        )}
        
        {errorStatus === "sent" && (
          <div className="p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            错误已发送到 Sentry！
          </div>
        )}
        
        {errorStatus === "failed" && (
          <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            发送错误失败，请检查控制台
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded max-w-md w-full">
        <h2 className="font-bold mb-2">调试提示：</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>查看浏览器控制台中的 Sentry 日志</li>
          <li>检查网络面板中是否有对 sentry.io 的请求</li>
          <li>确保没有广告拦截器阻止 Sentry 请求</li>
          <li>在 Sentry 项目设置中检查 DSN 是否正确</li>
        </ul>
      </div>
    </div>  
  );
}
