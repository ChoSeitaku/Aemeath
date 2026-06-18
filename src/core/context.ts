/**
 * 上下文管理器
 * 管理对话上下文，包括当前对话和用户信息
 */

/**
 * 用户上下文
 */
export interface UserContext {
  userId: string;
  name?: string;
  preferences: Record<string, any>;
  sessionStart: Date;
  lastActive: Date;
}

/**
 * 上下文管理器
 */
export class ContextManager {
  private userContext: UserContext;
  private sessionContext: Map<string, any>;

  constructor(userId: string = 'default') {
    this.userContext = {
      userId,
      preferences: {},
      sessionStart: new Date(),
      lastActive: new Date(),
    };
    this.sessionContext = new Map();
  }

  /**
   * 更新用户上下文
   */
  updateUserContext(updates: Partial<UserContext>): void {
    this.userContext = {
      ...this.userContext,
      ...updates,
      lastActive: new Date(),
    };
  }

  /**
   * 获取用户上下文
   */
  getUserContext(): UserContext {
    return { ...this.userContext };
  }

  /**
   * 设置会话变量
   */
  setSession(key: string, value: any): void {
    this.sessionContext.set(key, value);
  }

  /**
   * 获取会话变量
   */
  getSession(key: string): any {
    return this.sessionContext.get(key);
  }

  /**
   * 检查会话变量是否存在
   */
  hasSession(key: string): boolean {
    return this.sessionContext.has(key);
  }

  /**
   * 删除会话变量
   */
  deleteSession(key: string): boolean {
    return this.sessionContext.delete(key);
  }

  /**
   * 清除会话
   */
  clearSession(): void {
    this.sessionContext.clear();
    this.userContext.sessionStart = new Date();
  }

  /**
   * 获取上下文摘要
   */
  getSummary(): string {
    return `用户: ${this.userContext.userId}, 会话开始: ${this.userContext.sessionStart.toLocaleString()}`;
  }

  /**
   * 获取所有会话变量
   */
  getAllSession(): Record<string, any> {
    return Object.fromEntries(this.sessionContext);
  }

  /**
   * 设置用户偏好
   */
  setPreference(key: string, value: any): void {
    this.userContext.preferences[key] = value;
    this.userContext.lastActive = new Date();
  }

  /**
   * 获取用户偏好
   */
  getPreference(key: string): any {
    return this.userContext.preferences[key];
  }

  /**
   * 获取所有偏好
   */
  getAllPreferences(): Record<string, any> {
    return { ...this.userContext.preferences };
  }
}
