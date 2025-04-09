import { ReactNode } from 'react';
import { Metadata } from 'next';
import MonitoringClientWrapper from './MonitoringClientWrapper';

// Metadata 需要在单独的服务器组件中定义
export const metadata: Metadata = {
  title: 'Monitoring System',
  description: 'A monitoring system built with Next.js and Nest.js',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MonitoringClientWrapper>
          {children}
        </MonitoringClientWrapper>
      </body>
    </html>
  );
} 