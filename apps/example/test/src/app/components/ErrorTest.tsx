"use client";

import { useState } from "react";

// 辅助函数 - 获取北京时间的格式化字符串
function getBeiJingTime(): string {
  const now = new Date();
  // 转换为北京时间 (UTC+8)
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return beijingTime.toISOString().replace('Z', '+08:00');
}

// 一个有意会抛出错误的组件
export function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    // 当shouldError为true时，组件会抛出错误
    throw new Error("Error Test Component故意抛出的错误 " + getBeiJingTime());
  }
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-bold mb-2">ErrorBoundary 测试组件</h3>
      <p className="mb-3">点击按钮测试 ErrorBoundary 组件的错误捕获功能</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-700"
      >
        触发组件错误
      </button>
    </div>
  );
}

// 错误回退组件
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-4 bg-red-50 border border-red-300 rounded-md">
      <h3 className="text-lg font-bold text-red-700 mb-2">组件错误已被捕获</h3>
      <p className="text-red-600 mb-3">错误信息: {error.message}</p>
      <button
        onClick={resetError}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
      >
        重置组件
      </button>
    </div>
  );
} 