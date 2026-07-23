# Iteration 13 - Conversation turn cleanup

1. [Conversation] Optimistic message IDs could collide within one millisecond; they now inherit the unique turn token.
2. [Function] Active turns did not retain the optimistic message identity; the ID is now part of turn state.
3. [Conversation] Server-ignored duplicates remained visible locally; ignored turns now remove their optimistic row.
4. [Function] A keyboard message rejected as duplicate was lost; its content is now restored to the draft.
5. [Design] Restored duplicate input was easy to miss; the composer now reopens and regains focus.
6. [Conversation] A recovered reply poll left a stale connection warning visible; successful polling now clears it.
7. [Conversation] A completed reply could retain an earlier warning; successful completion now clears turn errors.
8. [Function] Completed turns retained their elapsed timer internally; completion now resets the clock.
9. [Function] Failed turns retained their elapsed timer internally; failure now resets the clock.
10. [Function] Cancelled turns retained their elapsed timer internally; cancellation now resets the clock.
