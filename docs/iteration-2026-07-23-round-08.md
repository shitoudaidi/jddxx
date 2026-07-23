# Iteration 08 - Speech lifecycle continuity

1. [Conversation] Wake greeting messages lacked timestamps; they now align with chat history chronology.
2. [Conversation] Wake self-check messages lacked timestamps; system narration now has a complete timeline.
3. [Function] Wake sequence failures exposed raw errors; they now use bounded user feedback.
4. [Conversation] TTS playback timeout had no visible explanation; users now see a clear timeout state.
5. [Conversation] Audio decode/playback errors had no distinct message; they now announce a recoverable audio failure.
6. [Conversation] Speech start did not update the textual status; the voice surface now says Jarvis is speaking.
7. [Conversation] Successful speech completion had no next-step cue; the status now says the user can continue.
8. [Design] Duplicate playback was silently dropped; the status now explains the guard instead of appearing stuck.
9. [Function] Unsupported Chinese-only speech fell back to a generic error; it now uses an alert visual state and specific status.
10. [Conversation] Manual TTS stop had no completion cue; the status now confirms that conversation can continue.
