/**
 * 消息列表组件
 * 显示对话历史消息
 */

import React from 'react';
import { Box, Text } from 'ink';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  streamingMessage 
}) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      
      {/* 流式输出 */}
      {streamingMessage && (
        <Box marginBottom={1}>
          <Text bold color="green">💬 </Text>
          <Text>{streamingMessage}</Text>
          <Text color="gray">▌</Text>
        </Box>
      )}
    </Box>
  );
};

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString();
  
  return (
    <Box marginBottom={1}>
      <Text bold color={isUser ? 'cyan' : 'green'}>
        {isUser ? '❯ ' : '💬 '}
      </Text>
      <Text>{message.content}</Text>
      <Text color="gray"> ({time})</Text>
    </Box>
  );
};

export default MessageList;
