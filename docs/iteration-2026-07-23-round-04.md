# Iteration 04 - Context rail continuity

1. [Function] AI news refresh could hang indefinitely; the request now has a 12-second timeout.
2. [Conversation] A previous offline error remained visible during a new refresh; starting a refresh clears the old error state.
3. [Design] The news rail looked unchanged while syncing; it now exposes an explicit SYNCING status.
4. [Function] Source links lacked a concise hover disclosure; each external item now names its source in a title.
5. [Function] The visible carousel item was not programmatically identified; the first visible item now exposes `aria-current`.
6. [Conversation] Empty news states were not announced; the empty rail now uses a polite status region.
7. [Function] Empty-state retry could be clicked repeatedly during a request; it now disables while loading.
8. [Aesthetic] News links had no keyboard focus treatment; they now use the same cyan focus ring as command controls.
9. [Aesthetic] News links had no press response; the active state now confirms selection without adding motion.
10. [Design] Stale news remains visually distinct from a clean offline state through the existing stale class and status vocabulary.
