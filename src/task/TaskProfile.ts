import Task from './Task';
import { TaskState } from './interface';

export default class TaskProfile {
  private readonly task: Task;

  constructor(task: Task) {
    this.task = task;
  }

  getStateText() {
    const state = this.task.getState();
    switch (state) {
      case TaskState.Completed:
        return '执行完成';
      case TaskState.SUCCESS:
        return '执行成功';
      case TaskState.RUNNING:
        return '执行中....';
      case TaskState.FAILED:
        return '执行失败';
      case TaskState.CANCEL:
        return '已取消';
      case TaskState.RETRY_PENDING:
        return '准备重试';
      default:
        return '初始化';
    }
  }

  toString() {
    const id = this.task.getId();
    const message = this.task.getMessage();
    const duration = this.task.getDuration();
    // const startTime = this.task.getStartTime();
    // const endTime = this.task.getEndTime();
    return `【TASK#${id}】 ${this.getStateText()} Duration: ${duration}ms  RESULT:${message}`;
  }
}
