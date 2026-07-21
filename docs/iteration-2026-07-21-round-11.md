# Jarvis Iteration 11 - Voice Capture Sensitivity

Time: 2026-07-21 20:00-20:15 (Asia/Shanghai)

## Ten problems found and fixed

1. **Recognition:** Conversation audio needed raw RMS 240 before ASR started. The gate is now 128 for quieter and more distant speech.
2. **Wake:** Wake audio needed raw RMS 48. The wake gate is now 32 while remaining below the conversation gate.
3. **Local VAD:** Whisper treated RMS below 0.005 as silence. The floor is now 0.003 for low-input microphones.
4. **Local VAD:** Near-speech required RMS 0.010. It now accepts 0.006 while later confidence filters still reject noise.
5. **Local VAD:** An utterance peak had to reach 0.015. The new 0.008 threshold admits soft far-field phrases.
6. **Short phrases:** Two voiced chunks were mandatory. One voiced chunk can now preserve a short wake phrase.
7. **Diagnostics:** The UI called anything below 0.006 a silent microphone. Its warning threshold now matches the 0.003 capture floor.
8. **Cold start:** Local Whisper loaded only after the first phrase. It now prewarms in the background at application startup when local voice is selected.
9. **Cold start:** Audio queued during model loading but the final flush was discarded. Flush intent now queues and executes as soon as Whisper connects.
10. **Device resilience:** An ended microphone track left the UI listening to nothing. Tracks now log mute transitions and automatically rebuild capture plus ASR after an unexpected end.

## Verification

- Added `scripts/probe-asr-sensitivity-contract.cjs` and included it in `npm run check`.
- Python compilation and JavaScript syntax checks passed.
- Wake sensitivity probe passed with wake=32 and conversation=128.
- Real 2.27-second synthesized Chinese PCM passed through the local Whisper WebSocket route and returned a final transcript after cold start.
- `npm run check` passed.

