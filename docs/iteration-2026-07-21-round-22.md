# Iteration 22 - Packaged user-experience E2E

1. Packaged tests could accidentally launch source Electron; the runner explicitly requires GDDXX-Jarvis.exe.
2. Packaged tests could use source resources; the runner explicitly points to packaged app.asar.
3. A white-label title regression could pass; the E2E now requires the GDDXX-Jarvis title.
4. A stale or hidden version could pass; the packaged footer must show v0.3.0.
5. The manual standby entrance could disappear; the E2E requires a visible 40px target.
6. Text could return inside the minimalist entrance; the E2E requires an SVG arrow with no text.
7. The shell could render while the core was dead; the packaged E2E now verifies /status.
8. The wake audio asset could be absent; it is now part of the success condition.
9. Wake acceptance without workbench completion could pass; narration, monitoring, and active mode remain mandatory.
10. A visible error banner could coexist with a green result; any visible startup error now fails the E2E.
