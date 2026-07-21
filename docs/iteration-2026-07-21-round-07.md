# Jarvis Iteration 07 - Natural Turn Taking

Time: 2026-07-21 19:43-19:50 (Asia/Shanghai)

## Ten problems found and fixed

1. **Conversation flow:** Bare acknowledgements could trigger another filler response. They now close a completed exchange unless they authorize pending work.
2. **Conversation flow:** "Continue" could restart with a recap. It now advances from the next unfinished point.
3. **Conversation flow:** User corrections could make Jarvis defend its earlier reading. Corrections now replace the faulty premise before recomputing the answer.
4. **Conversation flow:** An interrupted draft could compete with the user's newest message. The latest interruption now owns the floor unless the user asks to resume.
5. **Decision quality:** The prompt simultaneously discouraged all clarification and allowed missing-fact questions. Reversible ambiguity now proceeds by contextual inference.
6. **Safety:** High-impact ambiguity could proceed after merely stating an assumption. Destructive, external, costly, credential-sensitive actions now require exactly one concrete missing fact.
7. **Tone:** Repeated failure complaints could receive apologies before useful status. Diagnosis, result, or blocker now comes first.
8. **Accuracy:** Missing evidence could invite plausible filler. Unknown names, dates, numbers, paths, quotes, and success claims must remain explicitly unknown.
9. **Voice:** Spoken replies had a vague "concise" requirement. Voice now defaults to the result first and no more than two short sentences unless detail is requested or required.
10. **Completeness:** Compound requests could lose later clauses. The contract now requires every distinct ask to be completed in the same turn.

## Verification

- Added `scripts/probe-conversation-contract.cjs` with contract assertions for all ten behaviors and a regression check for the removed absolute rule.
- Added the conversation contract probe to `npm run check`.
- `npm run check` passed, including build, syntax, tool routing, voice, wake, first-run, and conversation contract probes.

