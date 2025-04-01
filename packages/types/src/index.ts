// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER',
}

// Monitoring data types
export interface MetricData {
  id: string;
  timestamp: Date;
  value: number;
  unit: string;
  metricName: string;
  resourceId: string;
  tags?: Record<string, string>;
}

export interface AlertConfig {
  id: string;
  name: string;
  description?: string;
  metricName: string;
  threshold: number;
  comparisonOperator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  evaluationPeriods: number;
  enabled: boolean;
  notificationChannels: NotificationChannel[];
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'webhook';
  target: string;
}

// Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 