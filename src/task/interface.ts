import TaskProfile from './TaskProfile';
import Task from './Task';

export enum TaskState {
  INIT,
  RUNNING,
  FAILED,
  SUCCESS,
  CANCEL,
  Completed,
  RETRY_PENDING,
}

export interface ReportCallback {
  (...args: any[]): void;
}

export interface TaskOptions<T> {
  id: string;
  priority?: number;
  retryPriority?: number;
  retrievable?: boolean;

  onReport?: ReportCallback;

  callback: TaskCallback<T>;
}

export enum TaskExecuteResultCode {
  SUCCESS,
  FAILED,
  ERROR,
  EMPTY,
  RETRY_PENDING,
}

export interface TaskResult {
  state: boolean;
  error: null | Error;
  message: string;
}

export interface TaskExecuteResult {
  state: TaskExecuteResultCode;
  message: string;
  startTime: number;
  endTime: number;
  duration: number;
  profile: TaskProfile;
}

export interface TaskCallback<T> {
  (options: TaskCallbackOptions<T>, context: TaskContext): Promise<TaskResult>;
}

export interface TaskCallbackOptions<T> {
  data: T;
}

export interface TaskContext {
  report(args: any): void;
}

export interface TaskTimeLine<T> {
  id: string;
  state: TaskExecuteResultCode;
  startTime: number;
  endTime: number;
  duration: number;
  result: TaskExecuteResult;
  profile: string;
}

export enum TaskManagerState {
  INIT,
  IDLE,
  RESTART,
  BUSY,
  PAUSED,
  PAUSED_PENDING,
}

export interface TaskManagerEvent<T> extends EventMap {
  target: T;
}

export interface EventMap {
  type: string;
}

export interface TaskManagerCallback<T> {
  (e: TaskManagerEvent<T>): void;
}

export interface TaskSuccessCallback {
  (e: { task: Task; data: TaskExecuteResult }): void;
}

export interface TaskPauseCallback {
  (e: { duration: number }): void;
}

export interface TaskCompleteCallback {
  (e: TaskManagerRunState): void;
}

export interface TaskLoadCallback {
  (e: { task: Task }): void;
}

export interface TaskFailedCallback {
  (e: { task: Task; error: Error | null; message: string }): void;
}

export interface TaskReportCallback {
  (e: { task: Task; data: any }): void;
}

export interface TaskCancelCallback {
  (e: { task: Task; data: any }): void;
}

export interface TaskManagerEventMap extends EventMap {
  complete: TaskManagerCallback<TaskManagerRunState>;
  pause: TaskManagerCallback<{ duration: number }>;
  success: TaskManagerCallback<{ task: Task; data: TaskExecuteResult }>;
  failed: TaskManagerCallback<{ task: Task; error: Error | null; message: string }>;
  load: TaskManagerCallback<{ task: Task }>;
  report: TaskManagerCallback<{ task: Task; data: any }>;
  cancel: TaskManagerCallback<{ task: Task }>;
}

export interface TaskEventMap extends EventMap {
  report(...args: any[]): void;

  cancel(...args: any[]): void;
}

export interface TaskManagerOptions {
  limit?: number;
  retryLevel?: RetryLevel;
}

export interface TaskManagerRunState {
  success: number;
  failed: number;
  cancel: number;
  retry: number;
  active: number;
  activeId: string[];
  total: number;
  duration: number;
}

export enum RetryLevel {
  RETRY_FIRST,
  NORMAL_FIRST,
}
