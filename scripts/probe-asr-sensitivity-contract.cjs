const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const api = fs.readFileSync(path.join(root, 'src/core/api.js'), 'utf8')
const whisper = fs.readFileSync(path.join(root, 'src/core/voice/whisper_server.py'), 'utf8')
const core = fs.readFileSync(path.join(root, 'src/ui/voice/voice-core.js'), 'utf8')
const panel = fs.readFileSync(path.join(root, 'src/ui/voice/voice-panel.js'), 'utf8')
const localAsr = fs.readFileSync(path.join(root, 'src/core/voice/local-asr.js'), 'utf8')
const index = fs.readFileSync(path.join(root, 'src/core/index.js'), 'utf8')

const checks = [
  ['conversation audio opens ASR at low input', /ASR_SPEECH_RMS_THRESHOLD = 128/.test(api)],
  ['wake audio opens ASR at lower input', /ASR_WAKE_RMS_THRESHOLD = 32/.test(api)],
  ['wake threshold remains below conversation threshold', /ASR_WAKE_RMS_THRESHOLD/.test(api) && 32 < 128],
  ['local silence floor accepts quiet microphones', /SILENCE_RMS_THRESHOLD\s*= 0\.003/.test(whisper)],
  ['near-speech floor accepts distant speech', /NEAR_SPEECH_RMS_THRESHOLD\s*= 0\.006/.test(whisper)],
  ['utterance peak floor accepts soft speech', /MIN_UTTERANCE_PEAK_RMS\s*= 0\.008/.test(whisper)],
  ['one voiced chunk can preserve a short wake phrase', /MIN_UTTERANCE_VOICED_CHUNKS\s*= 1/.test(whisper)],
  ['low-input diagnostic matches the new floor', /peakVol \|\| 0\) < 0\.003/.test(panel)],
  ['ended microphone tracks automatically reconnect', /mic-track-ended[\s\S]{0,500}startCloudStream\(replacement/.test(core)],
  ['mute and unmute transitions remain diagnosable', /mic-track-muted/.test(core) && /mic-track-unmuted/.test(core)],
  ['local Whisper prewarms during application startup', /getVoiceConfig\(\)\?\.voiceProvider !== 'aliyun'[\s\S]{0,100}startVoiceServer\(\)/.test(index)],
  ['flush requests survive model warmup', /pendingFlush[\s\S]{0,1800}type: 'flush'/.test(localAsr)],
]

const results = checks.map(([name, ok]) => ({ name, ok }))
console.log(JSON.stringify({ ok: results.every(item => item.ok), checks: results }, null, 2))
if (results.some(item => !item.ok)) process.exit(1)
