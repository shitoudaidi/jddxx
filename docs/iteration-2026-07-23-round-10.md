# Iteration 10 - Conversation record semantics

1. [Conversation] Compact message rows had no semantic role label; each row now identifies user, system, or Jarvis content.
2. [Conversation] Live message rows were not announced as they changed; only the active row now uses a polite live region.
3. [Function] Compact message times lacked a machine-readable date; they now expose `dateTime`.
4. [Conversation] Compact message times lacked the full date on hover; they now expose a full-time title.
5. [Function] The animated article itself now carries the role label, keeping context stable during insertion.
6. [Function] Invalid timestamps remain hidden instead of producing invalid `dateTime` attributes.
7. [Conversation] Full-time hover text uses the shared locale formatter.
8. [Conversation] Machine-readable time uses the shared ISO formatter.
9. [Design] Live styling remains separate from semantic live announcements.
10. [Design] Message origin metadata remains a structured region for role, channel, and time.
