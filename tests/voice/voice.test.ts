/**
 * 语音模块测试
 */

import { describe, it, expect } from 'bun:test';
import { VoiceSynthesizer, createAemeathVoice, CHINESE_VOICES } from '../../src/voice/tts';
import { 
  AEMEATH_VOICE_PROFILE, 
  detectEmotion, 
  getVoiceConfigForEmotion
} from '../../src/voice/config';
import { getAemeathRecommendedVoices } from '../../src/voice/tts';
import { VoiceManager, createAemeathVoiceManager } from '../../src/voice/manager';

describe('VoiceSynthesizer', () => {
  describe('构造函数', () => {
    it('应该创建语音合成器实例', () => {
      const synthesizer = new VoiceSynthesizer();
      expect(synthesizer).toBeDefined();
    });

    it('应该使用默认配置', () => {
      const synthesizer = new VoiceSynthesizer();
      const config = synthesizer.getConfig();
      expect(config.voice).toBe('zh-CN-XiaoxiaoNeural');
    });

    it('应该使用自定义配置', () => {
      const synthesizer = new VoiceSynthesizer({
        voice: 'zh-CN-XiaoyiNeural',
        rate: '+10%',
      });
      const config = synthesizer.getConfig();
      expect(config.voice).toBe('zh-CN-XiaoyiNeural');
      expect(config.rate).toBe('+10%');
    });
  });

  describe('配置管理', () => {
    it('应该设置语音', () => {
      const synthesizer = new VoiceSynthesizer();
      synthesizer.setVoice('zh-CN-XiaoyiNeural');
      expect(synthesizer.getConfig().voice).toBe('zh-CN-XiaoyiNeural');
    });

    it('应该设置语速', () => {
      const synthesizer = new VoiceSynthesizer();
      synthesizer.setRate('+20%');
      expect(synthesizer.getConfig().rate).toBe('+20%');
    });

    it('应该设置音量', () => {
      const synthesizer = new VoiceSynthesizer();
      synthesizer.setVolume('+10%');
      expect(synthesizer.getConfig().volume).toBe('+10%');
    });

    it('应该设置音调', () => {
      const synthesizer = new VoiceSynthesizer();
      synthesizer.setPitch('+5Hz');
      expect(synthesizer.getConfig().pitch).toBe('+5Hz');
    });
  });

  describe('createAemeathVoice', () => {
    it('应该创建爱弥斯语音合成器', () => {
      const synthesizer = createAemeathVoice();
      expect(synthesizer).toBeDefined();
      const config = synthesizer.getConfig();
      expect(config.voice).toBe('zh-CN-XiaoxiaoNeural');
    });
  });
});

describe('CHINESE_VOICES', () => {
  it('应该包含中文语音列表', () => {
    expect(CHINESE_VOICES.xiaoxiao).toBe('zh-CN-XiaoxiaoNeural');
    expect(CHINESE_VOICES.xiaoyi).toBe('zh-CN-XiaoyiNeural');
  });
});

describe('AEMEATH_VOICE_PROFILE', () => {
  it('应该包含爱弥斯语音配置', () => {
    expect(AEMEATH_VOICE_PROFILE.name).toBe('爱弥斯');
    expect(AEMEATH_VOICE_PROFILE.voice).toBe('zh-CN-XiaoxiaoNeural');
  });

  it('应该包含情绪配置', () => {
    expect(AEMEATH_VOICE_PROFILE.emotions).toBeDefined();
    expect(AEMEATH_VOICE_PROFILE.emotions.happy).toBeDefined();
    expect(AEMEATH_VOICE_PROFILE.emotions.sad).toBeDefined();
  });
});

describe('detectEmotion', () => {
  it('应该检测开心情绪', () => {
    expect(detectEmotion('太好了！')).toBe('happy');
    expect(detectEmotion('嘻嘻')).toBe('happy');
  });

  it('应该检测难过情绪', () => {
    expect(detectEmotion('我很难过')).toBe('sad');
    expect(detectEmotion('呜呜')).toBe('sad');
  });

  it('应该检测兴奋情绪', () => {
    expect(detectEmotion('太棒了！')).toBe('excited');
    expect(detectEmotion('厉害')).toBe('excited');
  });

  it('应该检测生气情绪', () => {
    expect(detectEmotion('我很生气')).toBe('angry');
    expect(detectEmotion('讨厌')).toBe('angry');
  });

  it('应该检测撒娇情绪', () => {
    expect(detectEmotion('想你了')).toBe('cute');
    expect(detectEmotion('亲亲')).toBe('cute');
  });

  it('应该检测认真情绪', () => {
    expect(detectEmotion('认真地说')).toBe('serious');
    expect(detectEmotion('说实话')).toBe('serious');
  });

  it('应该默认返回开心', () => {
    expect(detectEmotion('今天天气不错')).toBe('happy');
  });
});

describe('getVoiceConfigForEmotion', () => {
  it('应该获取开心的语音配置', () => {
    const config = getVoiceConfigForEmotion('happy');
    expect(config.rate).toBe('+15%');
    expect(config.pitch).toBe('+8Hz');
  });

  it('应该获取难过的语音配置', () => {
    const config = getVoiceConfigForEmotion('sad');
    expect(config.rate).toBe('-10%');
    expect(config.pitch).toBe('-5Hz');
  });

  it('应该返回空对象对于未知情绪', () => {
    const config = getVoiceConfigForEmotion('unknown');
    expect(config).toEqual({});
  });
});

describe('getAemeathRecommendedVoices', () => {
  it('应该返回推荐音色列表', () => {
    const voices = getAemeathRecommendedVoices();
    expect(voices).toContain('zh-CN-XiaoxiaoNeural');
    expect(voices.length).toBeGreaterThan(0);
  });
});

describe('VoiceManager', () => {
  describe('构造函数', () => {
    it('应该创建语音管理器实例', () => {
      const manager = new VoiceManager();
      expect(manager).toBeDefined();
    });

    it('应该使用默认配置', () => {
      const manager = new VoiceManager();
      const status = manager.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.autoPlay).toBe(true);
    });

    it('应该使用自定义配置', () => {
      const manager = new VoiceManager({
        enabled: false,
        autoPlay: false,
      });
      const status = manager.getStatus();
      expect(status.enabled).toBe(false);
      expect(status.autoPlay).toBe(false);
    });
  });

  describe('状态管理', () => {
    it('应该启用语音', () => {
      const manager = new VoiceManager({ enabled: false });
      manager.enable();
      expect(manager.getStatus().enabled).toBe(true);
    });

    it('应该禁用语音', () => {
      const manager = new VoiceManager({ enabled: true });
      manager.disable();
      expect(manager.getStatus().enabled).toBe(false);
    });

    it('应该切换语音状态', () => {
      const manager = new VoiceManager({ enabled: true });
      const result = manager.toggle();
      expect(result).toBe(false);
      expect(manager.getStatus().enabled).toBe(false);
    });
  });

  describe('createAemeathVoiceManager', () => {
    it('应该创建爱弥斯语音管理器', () => {
      const manager = createAemeathVoiceManager();
      expect(manager).toBeDefined();
    });
  });
});
