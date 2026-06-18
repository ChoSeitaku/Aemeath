/**
 * 欢迎界面组件
 * 显示应用启动信息
 */

import React from 'react';
import { Box, Text } from 'ink';

interface WelcomeScreenProps {
  model?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  model = 'deepseek-v4-flash',
}) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
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
          模型: {model} · 记忆: 0条 · 工具: 0个
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          输入 /help 查看命令 · /quit 退出
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          ─────────────────────────────────────────────────────
        </Text>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
