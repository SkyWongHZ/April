import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

// 自定义格式化日期时间
const customTimestampFormat = winston.format((info) => {
  const date = new Date();
  // 格式化为YYYY-MM-DD HH:MM:SS
  const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);
  info.timestamp = formattedDate;
  return info;
});

// 配置日志颜色
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'blue',
  debug: 'magenta',
};

// 注册自定义颜色
winston.addColors(customColors);

export const winstonConfig: WinstonModuleOptions = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        customTimestampFormat(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `{"level":"${level}","message":"${message}","timestamp":"${timestamp}"}`;
        }),
      ),
    }),
    // 可选: 添加文件日志
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        customTimestampFormat(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        customTimestampFormat(),
        winston.format.json(),
      ),
    }),
  ],
}; 