# Iteration 15 - Settings visual verification

1. [Function] The settings probe depended on localized button text; it now uses the dialog opener semantic.
2. [Function] The probe could capture during the drawer transition; it now waits an additional compositor interval.
3. [Function] A present-but-hidden drawer counted as ready; computed visibility is now required.
4. [Aesthetic] A transparent drawer could pass DOM checks; computed opacity is now checked.
5. [Function] An invisible backdrop could pass geometry checks; computed backdrop visibility is now checked.
6. [Design] A non-dialog element could masquerade as settings; `role=dialog` is now required.
7. [Function] Modal state was not verified; `aria-modal=true` is now required.
8. [Design] The title relationship was not verified; the labelled title node is now required.
9. [Function] A drawer outside the viewport could pass child checks; viewport bounds are now required.
10. [Function] Snapshot success ignored several visual facts; the aggregate gate now includes all visibility and semantics checks.
