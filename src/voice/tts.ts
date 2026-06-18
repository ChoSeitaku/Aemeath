/**
 * 语音合成模块
 * 使用 Edge TTS 实现文本转语音，支持爱弥斯音色配置
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export interface VoiceConfig {
  voice: string;
  rate: string;
  volume: string;
  pitch: string;
}

export interface TTSOptions {
  voice?: string;
  rate?: string;
  volume?: string;
  pitch?: string;
  outputDir?: string;
}

export class VoiceSynthesizer {
  private config: VoiceConfig;
  private outputDir: string;

  constructor(options: TTSOptions = {}) {
    this.config = {
      voice: options.voice || 'zh-CN-XiaoxiaoNeural',
      rate: options.rate || '+0%',
      volume: options.volume || '+0%',
      pitch: options.pitch || '+0Hz',
    };
    this.outputDir = options.outputDir || path.join(os.tmpdir(), 'aemeath-tts');
    this.ensureOutputDir();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 合成语音
   */
  async synthesize(text: string, filename?: string): Promise<string> {
    const outputFilename = filename || `tts_${Date.now()}.mp3`;
    const outputPath = path.join(this.outputDir, outputFilename);

    const voiceParam = this.config.voice;
    const rateParam = this.config.rate;
    const volumeParam = this.config.volume;
    const pitchParam = this.config.pitch;

    // 转义文本中的特殊字符
    const escapedText = text
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, ' ');

    const command = `edge-tts --voice "${voiceParam}" --rate="${rateParam}" --volume="${volumeParam}" --pitch="${pitchParam}" --text "${escapedText}" --write-media "${outputPath}"`;

    try {
      await execAsync(command);
      return outputPath;
    } catch (error) {
      console.error('语音合成失败:', error);
      throw error;
    }
  }

  /**
   * 合成语音并播放
   */
  async synthesizeAndPlay(text: string): Promise<void> {
    const outputPath = await this.synthesize(text);
    await this.playAudio(outputPath);
  }

  /**
   * 播放音频文件
   */
  async playAudio(filePath: string): Promise<void> {
    const platform = process.platform;

    try {
      if (platform === 'win32') {
        // Windows
        await execAsync(`start "" "${filePath}"`);
      } else if (platform === 'darwin') {
        // macOS
        await execAsync(`afplay "${filePath}"`);
      } else {
        // Linux
        await execAsync(`mpv --no-video "${filePath}"`);
      }
    } catch (error) {
      console.error('音频播放失败:', error);
      throw error;
    }
  }

  /**
   * 获取可用的中文语音列表
   */
  async listChineseVoices(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('edge-tts --list-voices');
      const voices = stdout
        .split('\n')
        .filter(line => line.includes('zh-CN'))
        .map(line => {
          const match = line.match(/Name:\s*(.+)/);
          return match ? match[1].trim() : '';
        })
        .filter(Boolean);
      return voices;
    } catch (error) {
      console.error('获取语音列表失败:', error);
      return [];
    }
  }

  /**
   * 设置语音配置
   */
  setVoice(voice: string): void {
    this.config.voice = voice;
  }

  /**
   * 设置语速
   */
  setRate(rate: string): void {
    this.config.rate = rate;
  }

  /**
   * 设置音量
   */
  setVolume(volume: string): void {
    this.config.volume = volume;
  }

  /**
   * 设置音调
   */
  setPitch(pitch: string): void {
    this.config.pitch = pitch;
  }

  /**
   * 获取当前配置
   */
  getConfig(): VoiceConfig {
    return { ...this.config };
  }
}

/**
 * 爱弥斯语音配置
 */
export const AEMEATH_VOICE_CONFIG: TTSOptions = {
  // 使用 Xiaoxiao 作为基础音色（活泼可爱）
  voice: 'zh-CN-XiaoxiaoNeural',
  // 稍快的语速，显得更活泼
  rate: '+10%',
  // 正常音量
  volume: '+0%',
  // 稍高的音调，显得更年轻
  pitch: '+5Hz',
};

/**
 * 创建爱弥斯语音合成器
 */
export function createAemeathVoice(options?: Partial<TTSOptions>): VoiceSynthesizer {
  return new VoiceSynthesizer({
    ...AEMEATH_VOICE_CONFIG,
    ...options,
  });
}

/**
 * 可用的中文语音列表
 */
export const CHINESE_VOICES = {
  // 女声
  xiaoxiao: 'zh-CN-XiaoxiaoNeural',      // 活泼可爱
  xiaoyi: 'zh-CN-XiaoyiNeural',          // 温柔甜美
  xiaochen: 'zh-CN-XiaochenNeural',      // 成熟稳重
  xiaohan: 'zh-CN-XiaohanNeural',        // 知性优雅
  xiaomeng: 'zh-CN-XiaomengNeural',      // 萌萌哒
  xiaorui: 'zh-CN-XiaoruiNeural',        // 活力四射
  xiaoshuang: 'zh-CN-XiaoshuangNeural',  // 可爱俏皮
  xiaoxuan: 'zh-CN-XiaoxuanNeural',      // 活泼开朗
  xiaoyou: 'zh-CN-XiaoyouNeural',        // 温暖亲切
  
  // 男声
  yunxi: 'zh-CN-YunxiNeural',            // 阳光少年
  yunjian: 'zh-CN-YunjianNeural',        // 成熟稳重
  yunyang: 'zh-CN-YunyangNeural',        // 专业播音
  yunze: 'zh-CN-YunzeNeural',            // 温文尔雅
};

/**
 * 获取爱弥斯推荐音色
 */
export function getAemeathRecommendedVoices(): string[] {
  return [
    CHINESE_VOICES.xiaoxiao,    // 活泼可爱 - 推荐
    CHINESE_VOICES.xiaoyi,      // 温柔甜美
    CHINESE_VOICES.xiaoshuang,  // 可爱俏皮
    CHINESE_VOICES.xiaoxuan,    // 活泼开朗
  ];
}
