/**
 * 命令系统测试
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { CommandRegistry, createDefaultCommandRegistry, Command } from '../../src/cli/commands';

describe('CommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = new CommandRegistry();
  });

  describe('命令注册', () => {
    it('应该注册命令', () => {
      const command: Command = {
        name: 'test',
        aliases: ['t'],
        description: '测试命令',
        execute: () => '测试结果',
      };
      
      registry.register(command);
      const commands = registry.getCommandList();
      expect(commands.length).toBe(1);
      expect(commands[0].name).toBe('test');
    });

    it('应该注册别名', () => {
      const command: Command = {
        name: 'test',
        aliases: ['t', 'testing'],
        description: '测试命令',
        execute: () => '测试结果',
      };
      
      registry.register(command);
      
      // 通过别名执行
      const result = registry.execute('t', [], {});
      expect(result).toBe('测试结果');
    });
  });

  describe('命令执行', () => {
    it('应该执行命令', () => {
      const command: Command = {
        name: 'echo',
        aliases: [],
        description: '回显命令',
        execute: (args) => args.join(' '),
      };
      
      registry.register(command);
      const result = registry.execute('echo', ['hello', 'world'], {});
      expect(result).toBe('hello world');
    });

    it('应该返回 null 对于未知命令', () => {
      const result = registry.execute('unknown', [], {});
      expect(result).toBeNull();
    });
  });

  describe('命令解析', () => {
    it('应该检测命令', () => {
      expect(registry.isCommand('/help')).toBe(true);
      expect(registry.isCommand('hello')).toBe(false);
    });

    it('应该解析命令', () => {
      const { name, args } = registry.parseCommand('/help all');
      expect(name).toBe('help');
      expect(args).toEqual(['all']);
    });

    it('应该解析无参数命令', () => {
      const { name, args } = registry.parseCommand('/clear');
      expect(name).toBe('clear');
      expect(args).toEqual([]);
    });
  });

  describe('自动补全', () => {
    beforeEach(() => {
      registry.register({
        name: 'help',
        aliases: ['h'],
        description: '帮助',
        execute: () => '',
      });
      registry.register({
        name: 'history',
        aliases: ['hist'],
        description: '历史',
        execute: () => '',
      });
      registry.register({
        name: 'quit',
        aliases: ['q'],
        description: '退出',
        execute: () => '',
      });
    });

    it('应该获取补全建议', () => {
      const completions = registry.getCompletions('/he');
      expect(completions).toContain('/help');
    });

    it('应该获取别名补全', () => {
      const completions = registry.getCompletions('/h');
      expect(completions).toContain('/help');
      expect(completions).toContain('/history');
    });

    it('应该返回空数组对于非命令', () => {
      const completions = registry.getCompletions('hello');
      expect(completions).toEqual([]);
    });

    it('应该去重补全结果', () => {
      const completions = registry.getCompletions('/he');
      const unique = [...new Set(completions)];
      expect(completions.length).toBe(unique.length);
    });
  });

  describe('帮助文本', () => {
    it('应该生成帮助文本', () => {
      registry.register({
        name: 'test',
        aliases: ['t'],
        description: '测试命令',
        usage: '/test [参数]',
        execute: () => '',
      });
      
      const helpText = registry.getHelpText();
      expect(helpText).toContain('/test');
      expect(helpText).toContain('测试命令');
    });
  });
});

describe('createDefaultCommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = createDefaultCommandRegistry();
  });

  it('应该创建默认命令注册表', () => {
    expect(registry).toBeDefined();
  });

  it('应该包含所有默认命令', () => {
    const commands = registry.getCommandList();
    const commandNames = commands.map(c => c.name);
    
    expect(commandNames).toContain('help');
    expect(commandNames).toContain('clear');
    expect(commandNames).toContain('quit');
    expect(commandNames).toContain('history');
    expect(commandNames).toContain('status');
    expect(commandNames).toContain('version');
  });

  it('应该执行 help 命令', () => {
    const result = registry.execute('help', [], { registry });
    expect(result).toContain('帮助');
  });

  it('应该执行 clear 命令', () => {
    let cleared = false;
    const mockEngine = {
      clearHistory: () => { cleared = true; },
    };
    
    registry.execute('clear', [], { engine: mockEngine });
    expect(cleared).toBe(true);
  });

  it('应该执行 version 命令', () => {
    const result = registry.execute('version', [], {});
    expect(result).toContain('v1.0.0');
  });
});
