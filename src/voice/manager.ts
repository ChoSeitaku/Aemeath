/**
 * 语音管理器
 * 集成语音合成、情绪检测、音色切换等功能
 */

import { VoiceSynthesizer, TTSOptions, createAemeathVoice } from './tts';
import { 
  AEMEATH_VOICE_PROFILE, 
  detectEmotion, 
  getVoiceConfigForEmotion,
  AemeathVoiceProfile 
} from './config';

export interface VoiceManagerOptions {
  enabled?: boolean;
  autoPlay?: boolean;
  voice?: string;
  rate?: string;
  volume?: string;
  pitch?: string;
}

export class VoiceManager {
  private synthesizer: VoiceSynthesizer;
  private enabled: boolean;
  private autoPlay: boolean;
  private currentEmotion: string;

  constructor(options: VoiceManagerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.autoPlay = options.autoPlay ?? true;
    this.currentEmotion = 'happy';

    // 创建语音合成器
    this.synthesizer = createAemeathVoice({
      voice: options.voice,
      rate: options.rate,
      volume: options.volume,
      pitch: options.pitch,
    });
  }

  /**
   * 朗读文本
   */
  async speak(text: string, emotion?: string): Promise<string> {
    if (!this.enabled) {
      return '';
    }

    // 检测情绪
    const detectedEmotion = emotion || detectEmotion(text);
    this.currentEmotion = detectedEmotion;

    // 获取情绪对应的语音配置
    const emotionConfig = getVoiceConfigForEmotion(detectedEmotion);
    
    // 应用情绪配置
    if (emotionConfig.rate) {
      this.synthesizer.setRate(emotionConfig.rate);
    }
    if (emotionConfig.pitch) {
      this.synthesizer.setPitch(emotionConfig.pitch);
    }
    if (emotionConfig.volume) {
      this.synthesizer.setVolume(emotionConfig.volume);
    }

    // 合成语音
    const audioPath = await this.synthesizer.synthesize(text);

    // 自动播放
    if (this.autoPlay) {
      await this.synthesizer.playAudio(audioPath);
    }

    return audioPath;
  }

  /**
   * 朗读爱弥斯经典台词
   */
  async speakCatchphrase(index?: number): Promise<string> {
    const { AEMEATH_CATCHPHRASES } = await import('./config');
    
    const catchphrase = index !== undefined
      ? AEMEATH_CATCHPHRASES[index % AEMEATH_CATCHPHRASES.length]
      : AEMEATH_CATCHPHRASES[Math.floor(Math.random() * AEMEATH_CATCHPHRASES.length)];

    return this.speak(catchphrase.text, catchphrase.emotion);
  }

  /**
   * 打招呼
   */
  async greet(): Promise<string> {
    const greetings = [
      '嘿~漂泊者！今天也要一起努力哦！✨',
      '你好呀~爱弥斯在这里等你呢！🌟',
      '漂泊者！今天有什么计划吗？💫',
    ];
    
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return this.speak(greeting, 'happy');
  }

  /**
   * 告别
   */
  async farewell(): Promise<string> {
    const farewells = [
      '下次见啦~漂泊者要小心哦！✨',
      '拜拜~爱弥斯会一直在这里的！🌟',
      '要记得想我哦~💫',
    ];
    
    const farewell = farewells[Math.floor(Math.random() * farewells.length)];
    return this.speak(farewell, 'cute');
  }

  /**
   * 鼓励
   */
  async encourage(): Promise<string> {
    const encouragements = [
      '漂泊者一定可以的！爱弥斯相信你！✨',
      '加油！爱弥斯会一直支持你的！🌟',
      '没问题的！漂泊者最厉害了！💫',
    ];
    
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    return this.speak(encouragement, 'excited');
  }

  /**
   * 安慰
   */
  async comfort(): Promise<string> {
    const comforts = [
      '漂泊者...爱弥斯在这里陪你。💕',
      '没关系的，一切都会好起来的。✨',
      '爱弥斯会一直守护你的。🌟',
    ];
    
    const comfort = comforts[Math.floor(Math.random() * comforts.length)];
    return this.speak(comfort, 'sad');
  }

  /**
   * 开启语音
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * 关闭语音
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * 切换语音状态
   */
  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * 设置音色
   */
  setVoice(voice: string): void {
    this.synthesizer.setVoice(voice);
  }

  /**
   * 设置语速
   */
  setRate(rate: string): void {
    this.synthesizer.setRate(rate);
  }

  /**
   * 获取当前状态
   */
  getStatus(): {
    enabled: boolean;
    autoPlay: boolean;
    currentEmotion: string;
    config: AemeathVoiceProfile;
  } {
    return {
      enabled: this.enabled,
      autoPlay: this.autoPlay,
      currentEmotion: this.currentEmotion,
      config: AEMEATH_VOICE_PROFILE,
    };
  }
}

/**
 * 创建爱弥斯语音管理器
 */
export function createAemeathVoiceManager(
  options?: VoiceManagerOptions
): VoiceManager {
  return new VoiceManager(options);
}
