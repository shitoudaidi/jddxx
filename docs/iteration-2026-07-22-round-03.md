# Iteration 03 - Trustworthy message actions

1. [Function] Clipboard rejection caused an unhandled promise; copy failures now resolve into visible feedback.
2. [Function] Copy feedback timers survived unmount; the active timer is now cleared safely.
3. [Function] Copy success or failure was visual only; the action now announces its state politely.
4. [Function] Incomplete streaming replies exposed actions; live content is no longer copyable or replayable.
5. [Function] Old replies could replay over an active turn; replay is disabled until generation completes.
6. [Function] Message time exposed only hours and minutes; semantic markup now carries the full timestamp and tooltip.
7. [Function] Jump-to-latest always forced animation; reduced-motion users now receive an immediate scroll.
8. [Function] Empty search results required returning to the header; an inline clear-search action is provided.
9. [Function] Empty history only described keyboard input; it now offers a direct keyboard-input action.
10. [Function] Generic runtime errors were labelled as voice recovery; system and voice failures are now distinct.
