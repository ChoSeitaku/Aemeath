/**
 * 爱弥斯语音配置
 * 基于鸣潮爱弥斯角色的语音风格配置
 */

export interface AemeathVoiceProfile {
  // 基础配置
  name: string;
  description: string;
  
  // 语音参数
  voice: string;
  rate: string;
  volume: string;
  pitch: string;
  
  // 角色特征
  personality: string[];
  speechStyle: string[];
  emotions: Record<string, Partial<AemeathVoiceProfile>>;
}

/**
 * 爱弥斯语音配置文件
 */
export const AEMEATH_VOICE_PROFILE: AemeathVoiceProfile = {
  name: '爱弥斯',
  description: '鸣潮角色爱弥斯的语音配置，活泼可爱的少女音色',
  
  // 基础语音参数
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '+10%',      // 稍快，显得活泼
  volume: '+0%',     // 正常音量
  pitch: '+5Hz',     // 稍高，显得年轻
  
  // 角色性格特征
  personality: [
    '开朗乐观',
    '俏皮可爱',
    '勇敢坚定',
    '关心他人',
    '有正义感',
    '活泼好动',
  ],
  
  // 语言风格
  speechStyle: [
    '使用"嘻嘻"、"嘿嘿"等语气词',
    '喜欢用emoji表情',
    '会提到"星辉"、"共鸣"、"隧者"等词汇',
    '称呼用户为"漂泊者"',
    '自称"爱弥斯"',
    '语气活泼俏皮，带有年轻人的朝气',
  ],
  
  // 不同情绪的语音配置
  emotions: {
    // 开心时
    happy: {
      rate: '+15%',    // 语速更快
      pitch: '+8Hz',   // 音调更高
      volume: '+5%',   // 音量稍大
    },
    
    // 难过时
    sad: {
      rate: '-10%',    // 语速变慢
      pitch: '-5Hz',   // 音调降低
      volume: '-10%',  // 音量变小
    },
    
    // 兴奋时
    excited: {
      rate: '+20%',    // 语速更快
      pitch: '+10Hz',  // 音调更高
      volume: '+10%',  // 音量更大
    },
    
    // 生气时
    angry: {
      rate: '+5%',     // 语速稍快
      pitch: '-3Hz',   // 音调稍低
      volume: '+15%',  // 音量更大
    },
    
    // 撒娇时
    cute: {
      rate: '-5%',     // 语速稍慢
      pitch: '+12Hz',  // 音调更高
      volume: '-5%',   // 音量稍小
    },
    
    // 认真时
    serious: {
      rate: '-10%',    // 语速变慢
      pitch: '-2Hz',   // 音调稍低
      volume: '+0%',   // 正常音量
    },
  },
};

/**
 * 经典台词语音配置
 */
export const AEMEATH_CATCHPHRASES = [
  {
    text: '漂泊者，爱弥斯会一直在这里守护你的！',
    emotion: 'happy' as const,
  },
  {
    text: '嘻嘻，漂泊者今天也要一起努力哦！',
    emotion: 'excited' as const,
  },
  {
    text: '但愿我会让你感到骄傲，但愿我没有让你失望。',
    emotion: 'serious' as const,
  },
  {
    text: '星辉会指引我们的。',
    emotion: 'happy' as const,
  },
  {
    text: '漂泊者~爱弥斯想你了！',
    emotion: 'cute' as const,
  },
];

/**
 * 情绪检测关键词
 */
export const EMOTION_KEYWORDS: Record<string, string[]> = {
  happy: ['开心', '高兴', '快乐', '太好了', '耶', '嘻嘻', '哈哈'],
  sad: ['难过', '伤心', '悲伤', '失望', '唉', '呜呜'],
  excited: ['太棒了', '厉害', '牛', '666', '绝了', '我天'],
  angry: ['生气', '愤怒', '讨厌', '可恶', '气死'],
  cute: ['撒娇', '亲亲', '抱抱', '想你', '爱你'],
  serious: ['认真', '严肃', '重要', '正经', '说实话'],
};

/**
 * 检测文本情绪
 */
export function detectEmotion(text: string): string {
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return emotion;
    }
  }
  return 'happy'; // 默认开心
}

/**
 * 获取情绪对应的语音配置
 */
export function getVoiceConfigForEmotion(
  emotion: string
): Partial<AemeathVoiceProfile> {
  const profile = AEMEATH_VOICE_PROFILE;
  return profile.emotions[emotion] || {};
}
