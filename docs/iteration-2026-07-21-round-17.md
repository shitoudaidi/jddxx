# Iteration 17 - Predictable keyboard voice controls

1. Space on a focused button could start PTT instead of activating the button; buttons are now protected.
2. Space on a focused link could start PTT; links are now treated as interactive.
3. Contenteditable editors were mistaken for empty page space; they now suppress global shortcuts.
4. Custom role=button controls were not protected; they now behave like native buttons.
5. IME composition keystrokes could reach global shortcuts; composing events are ignored.
6. Ctrl, Alt, or Command combinations could accidentally open input or PTT; modified keys are ignored.
7. Repeated keydown packets could start PTT more than once; held state now gates startup.
8. An unmatched Space keyup could stop a voice session started elsewhere; only owned PTT is released.
9. Releasing Space after the window lost focus could be missed; window blur now ends PTT.
10. Hiding the app while speaking could leave PTT active; visibility loss now ends it and cleanup does too.
