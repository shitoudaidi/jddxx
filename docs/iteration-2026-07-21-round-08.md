# Jarvis Iteration 08 - Rendering And Accessibility

Time: 2026-07-21 19:45-19:55 (Asia/Shanghai)

## Ten problems found and fixed

1. **Performance:** Every device rendered 76,000 particles. The budget now adapts to CPU core count and available memory, dropping to 42,000 on low-power systems.
2. **Performance:** High device pixel ratios multiplied fill cost on integrated graphics. Low-power systems now cap WebGL pixel ratio at 1.15.
3. **Motion:** Windows reduced-motion preference stopped CSS animation but not WebGL. It now uses a smaller particle budget and renders a stable frame.
4. **Performance:** Hidden windows continued requesting animation frames. Rendering now pauses while the document is hidden and resumes on visibility change.
5. **Performance:** An offscreen particle canvas continued consuming GPU time. Intersection observation now pauses it until visible.
6. **Resilience:** WebGL context loss left a broken canvas. Context loss is handled and the existing CSS entity treatment remains as the fallback.
7. **Accessibility:** Conversation progress was visual only. The history region now exposes `aria-busy` during an active turn.
8. **Accessibility:** The command field did not identify its live status source. It now references the turn-status live region with `aria-describedby`.
9. **Accessibility:** The command dock lacked a landmark name. It now exposes `Jarvis 指令输入` to assistive technology.
10. **Input design:** Focus visibility and compact targets were weak outside mouse use. Focus contrast is stronger, forced-colors mode uses system Highlight, and coarse-pointer auxiliary targets are at least 40px.

## Verification

- Added `scripts/probe-render-accessibility.cjs` and included it in `npm run check`.
- `npm run check` passed.
- `npm run probe:layout` passed five scenarios with no overflow or overlap.
- Standard and minimum screenshots retained a nonblank, correctly framed particle entity after adaptive rendering changes.

