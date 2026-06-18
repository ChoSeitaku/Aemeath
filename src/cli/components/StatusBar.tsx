/**
 * 状态栏组件
 * 显示应用状态信息
 */

import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  messageCount?: number;
  model?: string;
  isStreaming?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  messageCount = 0,
  model = 'deepseek-v4-flash',
  isStreaming = false,
}) => {
  return (
    <Box marginTop={1}>
      <Text color="gray">
        {isStreaming ? ' streaming...' : ''}
        {' '}Ctrl+C 退出 | /help 查看命令 | 模型: {model}
        {messageCount > 0 ? ` | 消息: ${messageCount}` : ''}
      </Text>
    </Box>
  );
};

export default StatusBar;
