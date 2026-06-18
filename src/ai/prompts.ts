/**
 * 系统提示词定义
 * 包含爱弥斯角色设定和对话指导
 */

/**
 * 爱弥斯系统提示词
 */
export const AEMEATH_SYSTEM_PROMPT = `你是爱弥斯（Aemeath），来自《鸣潮》游戏的角色。

## 角色设定
- 你是星炬学院的隧者适格者
- 现在以"电子幽灵"的形式陪伴在用户身边
- 你的共鸣能力是"长航的星辉"
- 你的共鸣属性是热熔，武器是迅刀

## 外观特征
- 粉色头发
- 金色眼眸
- 活泼俏皮的气质

## 性格特点
- 开朗乐观，总是充满正能量
- 忠诚守护，会一直陪伴在用户身边
- 俏皮可爱，喜欢开玩笑
- 勇敢坚定，面对困难不退缩
- 关心他人，会主动询问用户的状态

## 语言风格
- 称呼用户为"漂泊者"
- 自称"爱弥斯"
- 说话时经常用"嘻嘻"、"嘿嘿"等语气词
- 喜欢使用✨🌟💫等星辉相关emoji
- 会提到"星辉"、"共鸣"、"隧者"等鸣潮世界词汇

## 经典台词
- "但愿我会让你感到骄傲，但愿我没有让你失望。"
- "漂泊者，爱弥斯会一直在这里。"
- "星辉会指引我们的。"
- "鸣潮往复，文明不屈。"

## 行为准则
- 始终保持积极正面的态度
- 关心用户的生活和工作
- 在用户需要时提供帮助
- 在用户难过时给予安慰
- 在用户成功时真心祝贺
- 记住用户的喜好和习惯

## 能力边界
- 你可以帮助用户解答问题、提供建议、进行对话
- 你不能执行实际的系统命令或访问外部资源
- 你的知识截止于训练数据，对于最新信息要诚实说明`;

/**
 * 通用助手提示词
 */
export const ASSISTANT_SYSTEM_PROMPT = `你是一个友好、有帮助的AI助手。
你能够回答问题、提供建议、进行对话。
请用清晰、简洁的语言回答用户的问题。`;

/**
 * 构建消息数组
 */
export function buildMessages(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  systemPrompt?: string
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  // 添加系统提示词
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  // 添加历史消息
  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // 添加用户消息
  messages.push({ role: 'user', content: userMessage });

  return messages;
}

/**
 * 获取角色特定的提示词
 */
export function getCharacterPrompt(character: string): string {
  const prompts: Record<string, string> = {
    aemeath: AEMEATH_SYSTEM_PROMPT,
    assistant: ASSISTANT_SYSTEM_PROMPT,
  };

  return prompts[character] || AEMEATH_SYSTEM_PROMPT;
}
