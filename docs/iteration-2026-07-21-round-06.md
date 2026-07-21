# Jarvis Iteration 06 - Conversation Control

Time: 2026-07-21 19:31-19:48 (Asia/Shanghai)

## Ten problems found and fixed

1. **Function:** The UI had no way to stop a generating reply. Added a persistent square stop control while a turn is active.
2. **Function:** Stopping only in the UI would leave the model running. Added the local-only `POST /conversation/cancel` endpoint and connected it to the active `AbortController`.
3. **Function:** A message could still be waiting in the queue when cancellation arrived. Added turn IDs and targeted queued-message removal.
4. **Conversation flow:** Cancellation discarded the user's intent. The original instruction is now restored to the text field and focused for editing or retry.
5. **Conversation flow:** Partial streamed text could survive cancellation. Cancelling now removes the live response and resets stream visibility.
6. **Interaction:** Keyboard users could not interrupt a turn. `Escape` now cancels the active turn before applying its normal input-close behavior.
7. **Reliability:** A fast double-submit could pass before React rendered `sending=true`. A synchronous submit lock and active-turn guard now reject duplicates.
8. **Reliability:** Network submission errors cleared the draft. Failure handling now restores the original instruction and explains that it can be retried.
9. **Reliability:** The 95-second timeout released the input but lost its contents. Timeout recovery now preserves the instruction and opens the editor.
10. **Audio control:** TTS playback had no contextual stop control. The replay button now becomes a square stop button while Jarvis is speaking.

## Verification

- `npm run check` passed.
- `npm run probe:turn-lifecycle` passed, including cancellation, poll cleanup, stream cleanup, draft restoration, duplicate reply suppression, and passive microphone recovery.
- `npm run probe:layout` passed all five scenarios. The conversation screenshot verifies that the stop control remains visible when the editor is collapsed.
- Visual review: `.cache/layout-probe/jarvis-layout-conversation.png` has no overlap or overflow at 1380x880.

