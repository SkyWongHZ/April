import * as Sentry from '@sentry/browser';
import { App, Component, ComponentPublicInstance, Plugin } from 'vue';
import { initMonitoring, MonitoringOptions } from './index';

/**
 * Vue 错误处理选项
 */
interface VueErrorHandlerOptions {
  logErrors?: boolean;
  attachProps?: boolean;
  attachComponentName?: boolean;
}

/**
 * Vue 监控插件选项
 */
export interface VueMonitoringOptions extends MonitoringOptions {
  Vue?: App;
  errorHandlerOptions?: VueErrorHandlerOptions;
  trackComponents?: boolean;
}

/**
 * 创建 Vue 监控插件
 * @param options 监控选项
 * @returns Vue 插件对象
 */
export function createVueMonitoring(options: VueMonitoringOptions): Plugin {
  // 如果没有提供 Vue 实例，返回一个插件对象
  return {
    install(app: App) {
      // 初始化基础监控
      initMonitoring(options);

      // 设置全局错误处理
      const {
        errorHandlerOptions = { logErrors: true, attachProps: true, attachComponentName: true },
        trackComponents = true
      } = options;

      // 添加错误处理
      app.config.errorHandler = (error, instance, info) => {
        const componentName = instance?.type ? 
          (typeof instance.type === 'string' ? instance.type : instance.type.name) : 
          'Anonymous';

        // 使用 Sentry 捕获错误
        Sentry.withScope((scope) => {
          // 添加错误上下文信息
          scope.setTag('vue', 'error');
          
          if (errorHandlerOptions.attachComponentName && componentName) {
            scope.setTag('vue.component', componentName);
          }

          if (info) {
            scope.setExtra('vue.info', info);
          }

          // 附加组件实例上的属性
          if (errorHandlerOptions.attachProps && instance) {
            const props = instance.props || {};
            Object.keys(props).forEach(key => {
              // 避免附加过大的对象或敏感信息
              const propValue = props[key];
              if (typeof propValue !== 'function' && typeof propValue !== 'object') {
                scope.setExtra(`vue.props.${key}`, propValue);
              }
            });
          }

          Sentry.captureException(error);
        });

        // 可选地将错误输出到控制台
        if (errorHandlerOptions.logErrors) {
          console.error('Vue Error:', error);
          console.error('Component:', componentName);
          if (info) console.info('Error Info:', info);
        }
      };

      // 组件性能跟踪
      if (trackComponents) {
        app.mixin({
          beforeCreate() {
            const componentName = this.$options.name || 'AnonymousComponent';
            this._spanId = `vue-component-${componentName}-${Date.now()}`;
            
            Sentry.addBreadcrumb({
              category: 'component',
              message: `Component ${componentName} created`,
              level: 'info'
            });
          },
          mounted() {
            if (!this._spanId) return;
            const componentName = this.$options.name || 'AnonymousComponent';
            
            Sentry.addBreadcrumb({
              category: 'component',
              message: `Component ${componentName} mounted`,
              level: 'info'
            });
          },
          beforeUnmount() {
            if (!this._spanId) return;
            const componentName = this.$options.name || 'AnonymousComponent';
            
            Sentry.addBreadcrumb({
              category: 'component',
              message: `Component ${componentName} unmounted`,
              level: 'info'
            });
          }
        });
      }
    }
  };
}

/**
 * 高阶组件: 用错误处理包装 Vue 组件
 * @param component 要包装的组件
 * @returns 包装后的组件
 */
export function withErrorHandling<T extends Component>(component: T): T {
  const originalErrorCaptured = component.errorCaptured;
  
  component.errorCaptured = function(err, instance, info) {
    // 捕获错误并发送到 Sentry
    Sentry.withScope((scope) => {
      const componentName = instance.$options.name || 'Anonymous';
      scope.setTag('vue.component', componentName);
      scope.setExtra('vue.error.info', info);
      Sentry.captureException(err);
    });
    
    // 调用原始的 errorCaptured 钩子（如果存在）
    if (originalErrorCaptured) {
      return originalErrorCaptured.call(this, err, instance, info);
    }
    
    // 默认返回 false 以防止错误继续传播
    return false;
  };
  
  return component;
} 