import React, { useState, useEffect } from 'react';
import { 
  MonitoringProvider, 
  ErrorBoundary, 
  withErrorReporting 
} from '@monitoring/monitoring/react';
import { captureMessage, monitorPerformance } from '@monitoring/monitoring';

// 1. 包含监控的应用入口组件
function App() {
  return (
    <MonitoringProvider
      options={{
        dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
        environment: process.env.NODE_ENV || 'development',
        release: '1.0.0',
        sampleRate: 0.1,
        enablePerformance: true,
        tags: {
          app: 'react-example'
        }
      }}
    >
      <MainContent />
    </MonitoringProvider>
  );
}

// 2. 主要内容组件
function MainContent() {
  return (
    <div className="app">
      <header>
        <h1>监控系统 React 示例</h1>
      </header>
      
      <main>
        {/* 使用错误边界包装可能出错的组件 */}
        <ErrorBoundary 
          fallback={<ErrorFallback />}
          onError={(error, componentStack) => {
            console.error('组件错误', error, componentStack);
          }}
        >
          <Counter />
          <BuggyComponent />
        </ErrorBoundary>
        
        <PerformanceDemo />
        <EventLogger />
      </main>
    </div>
  );
}

// 3. 错误退回组件
function ErrorFallback() {
  return (
    <div className="error-container">
      <h3>哎呀，出错了！</h3>
      <p>我们已记录此问题并将尽快修复。</p>
      <button onClick={() => window.location.reload()}>
        刷新页面
      </button>
    </div>
  );
}

// 4. 计数器组件
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setCount(count + 1);
    
    // 记录用户操作
    if (count % 10 === 0) {
      captureMessage(`用户点击计数达到 ${count}`, {
        level: 'info',
        tags: { feature: 'counter' }
      });
    }
  };
  
  return (
    <div className="widget counter">
      <h2>计数器: {count}</h2>
      <button onClick={handleIncrement}>增加</button>
    </div>
  );
}

// 5. 一个故意出错的组件
class BuggyComponent extends React.Component {
  state = {
    shouldCrash: false
  };
  
  handleCrashClick = () => {
    this.setState({ shouldCrash: true });
  };
  
  render() {
    if (this.state.shouldCrash) {
      // 故意抛出错误
      throw new Error('用户触发的故意崩溃');
    }
    
    return (
      <div className="widget buggy">
        <h2>错误测试</h2>
        <button onClick={this.handleCrashClick}>
          触发错误
        </button>
        <p>点击按钮将触发组件错误</p>
      </div>
    );
  }
}

// 6. 性能演示组件
function PerformanceDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  const simulateDataFetch = () => {
    setIsLoading(true);
    setLoadTime(null);
    
    // 标记开始
    monitorPerformance.mark('data-fetch-start');
    
    // 模拟 API 调用
    setTimeout(() => {
      // 标记结束
      monitorPerformance.mark('data-fetch-end');
      
      // 测量持续时间
      monitorPerformance.measure(
        'data-fetch-duration',
        'data-fetch-start',
        'data-fetch-end'
      );
      
      try {
        // 尝试读取测量结果
        const measure = window.performance.getEntriesByName('data-fetch-duration')[0];
        if (measure && 'duration' in measure) {
          setLoadTime((measure as PerformanceMeasure).duration);
        }
      } catch (e) {
        console.error('无法读取性能测量', e);
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="widget performance">
      <h2>性能测试</h2>
      <button onClick={simulateDataFetch} disabled={isLoading}>
        {isLoading ? '加载中...' : '模拟数据加载'}
      </button>
      {loadTime !== null && (
        <p>加载耗时: {loadTime.toFixed(2)} ms</p>
      )}
    </div>
  );
}

// 7. 使用高阶组件包装的组件
class EventLoggerBase extends React.Component {
  logEvent = (eventName: string) => {
    captureMessage(`用户触发事件: ${eventName}`, {
      level: 'info',
      tags: { feature: 'event-logger' }
    });
    alert(`已记录事件: ${eventName}`);
  };
  
  render() {
    return (
      <div className="widget event-logger">
        <h2>事件记录</h2>
        <div className="button-group">
          <button onClick={() => this.logEvent('注册')}>
            记录注册事件
          </button>
          <button onClick={() => this.logEvent('购买')}>
            记录购买事件
          </button>
        </div>
      </div>
    );
  }
}

// 使用高阶组件添加错误报告
const EventLogger = withErrorReporting(EventLoggerBase);

export default App; 