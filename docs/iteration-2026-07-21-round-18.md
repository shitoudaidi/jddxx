# Iteration 18 - Calm long-turn feedback

1. Live status changed every second and could repeatedly interrupt screen readers; seconds are now visual-only.
2. Elapsed time was embedded in prose and hard to scan; it now has a compact monospace element.
3. The first few seconds had no acknowledgement phase; they now say the instruction is being understood.
4. Normal model latency had no distinct phase; it now moves to thinking after five seconds.
5. Tool-scale work looked identical to a short answer; after fifteen seconds it says the task is processing.
6. Long work appeared frozen; after forty seconds it explicitly says the complex task is still running.
7. Near-timeout work gave no warning; after seventy seconds it says the core is being awaited.
8. Waiting had no visual continuity; a restrained rail now fills toward the 95-second boundary.
9. Progress was not machine-readable; it now exposes progressbar values and a descriptive label.
10. Progress jumped sharply; width changes now ease linearly and inherit reduced-motion behavior.
