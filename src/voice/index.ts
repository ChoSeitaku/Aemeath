/**
 * 语音模块导出
 */

export { VoiceSynthesizer, createAemeathVoice, CHINESE_VOICES, AEMEATH_VOICE_CONFIG, getAemeathRecommendedVoices } from './tts';
export type { VoiceConfig, TTSOptions } from './tts';

export { AEMEATH_VOICE_PROFILE, AEMEATH_CATCHPHRASES, detectEmotion, getVoiceConfigForEmotion } from './config';
export type { AemeathVoiceProfile } from './config';

export { VoiceManager, createAemeathVoiceManager } from './manager';
export type { VoiceManagerOptions } from './manager';
