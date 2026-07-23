# Iteration 03 - Voice surface continuity

1. [Conversation] The voice panel had no semantic group label; it now identifies the voice interaction surface.
2. [Accessibility] The visual canvas was exposed as content; it is now explicitly decorative.
3. [Conversation] Voice status was plain text; it now uses a polite status live region.
4. [Conversation] ASR transcript was plain text; it now uses a polite log live region.
5. [Conversation] Transcript updates could cause excessive announcements; the log is explicitly non-atomic.
6. [Aesthetic] Status text could change height as states changed; it now reserves a stable line.
7. [Aesthetic] Transcript width was unconstrained; it now has a readable 44-character measure.
8. [Aesthetic] Long transcript text could reflow the central composition; it now clips with an ellipsis.
9. [Conversation] Transcript wrapping could push nearby visual elements; it now stays on one controlled line.
10. [Function] The transcript was hidden even while diagnostics were being written; it is now available as a compact visible readout.
