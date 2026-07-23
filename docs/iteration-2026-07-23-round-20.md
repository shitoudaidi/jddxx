# Iteration 20 - Unsaved settings protection

1. [Function] Model settings had no saved baseline; provider, model, and URL now track one.
2. [Function] AI HOT settings had no saved baseline; the endpoint now tracks one.
3. [Function] The drawer could not tell whether either form changed; dirty state is now unified.
4. [Function] Closing could silently discard edits; dirty close now requires confirmation.
5. [Function] Escape bypassed unsaved-state protection; it now uses the guarded close path.
6. [Function] Backdrop clicks bypassed unsaved-state protection; they now use the guarded close path.
7. [Function] The close icon bypassed unsaved-state protection; it now uses the guarded close path.
8. [Design] Model save looked actionable without changes; it is now disabled while clean.
9. [Design] AI HOT save looked actionable without changes; it is now disabled while clean.
10. [Aesthetic] Users could not see pending edits; the sticky header now shows an `未保存` status.
