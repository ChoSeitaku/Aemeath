/**
 * 命令系统
 * 管理斜杠命令和自动补全
 */

export interface Command {
  name: string;
  aliases: string[];
  description: string;
  usage?: string;
  execute: (args: string[], context: any) => string;
}

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private commandList: Command[] = [];

  /**
   * 注册命令
   */
  register(command: Command): void {
    this.commands.set(command.name, command);
    this.commandList.push(command);
    
    // 注册别名
    for (const alias of command.aliases) {
      this.commands.set(alias, command);
    }
  }

  /**
   * 执行命令
   */
  execute(name: string, args: string[], context: any): string | null {
    const command = this.commands.get(name.toLowerCase());
    if (command) {
      return command.execute(args, context);
    }
    return null;
  }

  /**
   * 检查是否是命令
   */
  isCommand(input: string): boolean {
    return input.startsWith('/');
  }

  /**
   * 解析命令
   */
  parseCommand(input: string): { name: string; args: string[] } {
    const parts = input.slice(1).split(/\s+/);
    const name = parts[0] || '';
    const args = parts.slice(1);
    return { name, args };
  }

  /**
   * 获取命令列表
   */
  getCommandList(): Command[] {
    return [...this.commandList];
  }

  /**
   * 获取命令补全建议
   */
  getCompletions(input: string): string[] {
    if (!input.startsWith('/')) {
      return [];
    }

    const query = input.slice(1).toLowerCase();
    const completions: string[] = [];

    for (const command of this.commandList) {
      if (command.name.startsWith(query)) {
        completions.push(`/${command.name}`);
      }
      for (const alias of command.aliases) {
        if (alias.startsWith(query)) {
          completions.push(`/${alias}`);
        }
      }
    }

    return [...new Set(completions)];
  }

  /**
   * 获取帮助文本
   */
  getHelpText(): string {
    let text = '\n可用命令：\n\n';
    
    for (const command of this.commandList) {
      const aliases = command.aliases.length > 0 
        ? ` (${command.aliases.join(', ')})` 
        : '';
      text += `  /${command.name}${aliases} - ${command.description}\n`;
      if (command.usage) {
        text += `    用法: ${command.usage}\n`;
      }
    }
    
    text += '\n输入 /<命令名> 查看详细帮助\n';
    
    return text;
  }
}

/**
 * 创建命令注册表并注册所有命令
 */
export function createDefaultCommandRegistry(): CommandRegistry {
  const registry = new CommandRegistry();

  // /help 命令
  registry.register({
    name: 'help',
    aliases: ['h', '?'],
    description: '显示帮助信息',
    usage: '/help [命令名]',
    execute: (args, context) => {
      if (args.length > 0) {
        const commandName = args[0].replace('/', '');
        const command = context.registry.commands.get(commandName);
        if (command) {
          return `
命令: /${command.name}
别名: ${command.aliases.join(', ') || '无'}
描述: ${command.description}
${command.usage ? `用法: ${command.usage}` : ''}
`;
        }
        return `❌ 未知命令: ${args[0]}`;
      }
      return context.registry.getHelpText();
    },
  });

  // /clear 命令
  registry.register({
    name: 'clear',
    aliases: ['c'],
    description: '清空当前对话',
    execute: (args, context) => {
      context.engine.clearHistory();
      return '✅ 对话已清空';
    },
  });

  // /quit 命令
  registry.register({
    name: 'quit',
    aliases: ['q', 'exit'],
    description: '退出程序',
    execute: (args, context) => {
      context.exit();
      return '👋 再见！期待下次与你交流。';
    },
  });

  // /history 命令
  registry.register({
    name: 'history',
    aliases: ['hist'],
    description: '查看对话历史',
    usage: '/history [数量]',
    execute: (args, context) => {
      const limit = parseInt(args[0]) || 10;
      const history = context.engine.getHistory();
      
      if (history.length === 0) {
        return '📝 暂无对话历史';
      }

      const recent = history.slice(-limit);
      let text = `\n最近 ${recent.length} 条对话：\n\n`;
      
      for (const msg of recent) {
        const role = msg.role === 'user' ? '👤 你' : '💬 爱弥斯';
        const time = msg.timestamp.toLocaleTimeString();
        text += `[${time}] ${role}: ${msg.content}\n\n`;
      }
      
      return text;
    },
  });

  // /status 命令
  registry.register({
    name: 'status',
    aliases: ['st'],
    description: '查看状态信息',
    execute: (args, context) => {
      const history = context.engine.getHistory();
      const userMessages = history.filter(m => m.role === 'user').length;
      const assistantMessages = history.filter(m => m.role === 'assistant').length;
      
      return `
📊 状态信息

消息统计:
  用户消息: ${userMessages}
  助手回复: ${assistantMessages}
  总消息数: ${history.length}

模型: deepseek-v4-flash
版本: v1.0.0
`;
    },
  });

  // /version 命令
  registry.register({
    name: 'version',
    aliases: ['ver'],
    description: '查看版本信息',
    execute: () => {
      return `
Aemeath v1.0.0
爱弥斯 · 你的个人AI助手

技术栈:
  - Bun + TypeScript
  - Ink (CLI框架)
  - DeepSeek V4 Flash
  - Edge TTS (语音合成)
`;
    },
  });

  // /clear-all 命令
  registry.register({
    name: 'clear-all',
    aliases: [],
    description: '清空所有数据',
    execute: (args, context) => {
      context.engine.clearHistory();
      context.engine.getContext().clearSession();
      return '✅ 所有数据已清空';
    },
  });

  // /voice 命令
  registry.register({
    name: 'voice',
    aliases: ['v'],
    description: '语音控制',
    usage: '/voice on|off|status',
    execute: (args, context) => {
      const action = args[0]?.toLowerCase() || 'status';
      
      switch (action) {
        case 'on':
          return '🎤 语音已开启';
        case 'off':
          return '🔇 语音已关闭';
        case 'status':
          return '🎤 语音状态: 已就绪';
        default:
          return '用法: /voice on|off|status';
      }
    },
  });

  return registry;
}
