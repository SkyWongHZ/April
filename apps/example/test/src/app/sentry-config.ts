import { SentryCollector } from "sentry-collector";

// 创建SentryCollector实例
export const sentryCollector = new SentryCollector({
  dsn: "https://6ea7f94951bc4dac12d90a30ee77bf0b@o4509111158374400.ingest.us.sentry.io/4509132142346240",
  environment: process.env.NODE_ENV,
  enableInDev: true,
  autoCapture: true,
  tags: {
    source: "sentry-collector-test"
  }
}); 