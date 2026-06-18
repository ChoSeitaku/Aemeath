/**
 * 主应用组件
 * Aemeath CLI 界面 - 优化版
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { AemeathEngine, Message } from '../core/engine';
import { 
  CommandRegistry, 
  createDefaultCommandRegistry 
} from './commands';
import { useAutoComplete } from './hooks';

// 应用状态
interface AppState {
  messages: Message[];
  isLoading: boolean;
  streamingMessage: string;
  isReady: boolean;
  error: string | null;
}

// 主应用组件
export const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [],
    isLoading: false,
    streamingMessage: '',
    isReady: false,
    error: null,
  });

  const { exit } = useApp();

  // 初始化引擎
  const engine = useMemo(() => {
    try {
      return new AemeathEngine({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        model: process.env.DEEPSEEK_MODEL,
      });
    } catch (error) {
      return null;
    }
  }, []);

  // 初始化命令注册表
  const registry = useMemo(() => {
    return createDefaultCommandRegistry();
  }, []);

  // 获取命令列表用于自动补全
  const commandList = useMemo(() => {
    return registry.getCommandList().map(cmd => `/${cmd.name}`);
  }, [registry]);

  // 自动补全 Hook
  const {
    inputValue,
    completions,
    setInputValue,
    handleTab,
    resetCompletions,
  } = useAutoComplete({ commands: commandList });

  // 标记为就绪
  useEffect(() => {
    if (engine) {
      setState(prev => ({ ...prev, isReady: true }));
    }
  }, [engine]);

  // 处理输入提交
  const handleSubmit = useCallback(async (value: string) => {
    if (!value.trim() || !engine) return;

    // 检查是否是退出命令
    if (value.startsWith('/quit') || value.startsWith('/q') || value === '/exit') {
      exit();
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      streamingMessage: '',
    }));

    // 重置输入
    resetCompletions();

    // 处理输入
    try {
      // 检查是否是命令
      if (value.startsWith('/')) {
        const { name, args } = registry.parseCommand(value);
        const result = registry.execute(name, args, {
          engine,
          registry,
          exit,
        });
        
        if (result) {
          // 添加助手消息
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result,
            timestamp: new Date(),
          };

          setState(prev => ({
            ...prev,
            messages: [...prev.messages, assistantMessage],
            isLoading: false,
          }));
        }
      } else {
        // 流式处理
        let fullResponse = '';
        
        for await (const chunk of engine.processInputStream(value)) {
          fullResponse += chunk;
          setState(prev => ({
            ...prev,
            streamingMessage: fullResponse,
          }));
        }

        // 添加助手消息
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
          streamingMessage: '',
        }));
      }
    } catch (error) {
      console.error('处理输入失败:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        streamingMessage: '',
        error: '处理输入时出错',
      }));
    }
  }, [engine, registry, exit, resetCompletions]);

  // 处理快捷键
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
    }
    if (key.tab) {
      handleTab();
    }
  });

  // 显示错误信息
  if (!engine) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="red">
          ❌ 初始化失败
        </Text>
        <Text color="gray">
          请检查 DEEPSEEK_API_KEY 环境变量是否正确设置
        </Text>
        <Text color="gray">
          复制 .env.example 为 .env 并添加 API Key
        </Text>
      </Box>
    );
  }

  // 显示加载状态
  if (!state.isReady) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="yellow">⏳ 正在初始化...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* 欢迎界面 */}
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╔═══════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ║          A E M E A T H   v1.0.0                  ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ║          爱弥斯 · 你的个人AI助手                  ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╚═══════════════════════════════════════════════════╝
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          模型: deepseek-v4-flash · 记忆: {state.messages.length}条 · 工具: 0个
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          输入 /help 查看命令 · Tab 补全 · /quit 退出
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          ─────────────────────────────────────────────────────
        </Text>
      </Box>

      {/* 消息列表 */}
      <Box flexDirection="column" marginBottom={1}>
        {state.messages.map((msg) => (
          <Box key={msg.id} marginBottom={1}>
            <Text bold color={msg.role === 'user' ? 'cyan' : 'green'}>
              {msg.role === 'user' ? '❯ ' : '💬 '}
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        ))}
      </Box>

      {/* 流式输出 */}
      {state.isLoading && state.streamingMessage && (
        <Box marginBottom={1}>
          <Text bold color="green">💬 </Text>
          <Text>{state.streamingMessage}</Text>
          <Text color="gray">▌</Text>
        </Box>
      )}

      {/* 加载状态 */}
      {state.isLoading && !state.streamingMessage && (
        <Box marginBottom={1}>
          <Text color="yellow">💭 思考中...</Text>
        </Box>
      )}

      {/* 命令补全提示 */}
      {completions.length > 1 && (
        <Box marginBottom={1}>
          <Text color="gray">
            补全: {completions.join(' | ')}
          </Text>
        </Box>
      )}

      {/* 错误提示 */}
      {state.error && (
        <Box marginBottom={1}>
          <Text color="red">❌ {state.error}</Text>
        </Box>
      )}

      {/* 输入框 */}
      <Box>
        <Text bold color="cyan">❯ </Text>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          placeholder="输入消息..."
        />
      </Box>

      {/* 状态栏 */}
      <Box marginTop={1}>
        <Text color="gray">
          {state.isLoading ? ' streaming...' : ''}
          {' '}Ctrl+C 退出 | Tab 补全 | 模型: deepseek-v4-flash
          {state.messages.length > 0 ? ` | 消息: ${state.messages.length}` : ''}
        </Text>
      </Box>
    </Box>
  );
};

export default App;
