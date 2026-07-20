# Visual System

## Principle

The speaker is the trust layer. Motion is punctuation. Every visual must improve comprehension, proof, rhythm, or recall.

## Layer Hierarchy

| Primary layer | Purpose | May coexist with |
| --- | --- | --- |
| A-track speaker | Trust, explanation, judgment | Subtitle; one small secondary cue |
| B-track footage | Concrete illustration or real proof | Subtitle; one compact label |
| Full-screen card | Number, comparison, steps, conclusion | Subtitle only when spatially separate |
| Subtitle | Continuous comprehension | One non-competing primary layer |

Never show a giant keyword, a structured card, and a subtitle in the same zone.

## Density Budget

For a 60-90 second video:

- Keep the speaker clean for at least 55% of runtime.
- Use 6-9 short emphasis beats.
- Use 3-5 full-screen or structured-card beats.
- Use at most 2-3 dense lists.
- Keep total high-emphasis time near 25-35%.

Scale proportionally for other durations. Treat these as review thresholds, not targets to fill.

## Safe Zones

Derive safe zones from sampled source frames.

- Protect the face, mouth, eyes, and active hand gestures.
- Reserve the lower band for subtitles.
- Place supporting cards in verified negative space.
- Keep critical text inside a 5% outer-frame margin and platform UI-safe regions.

For `9:16`, prefer full-frame speaker, side tags, upper/lower negative space, and brief full-screen cards. For `16:9`, keep A-track dominant and place restrained cards or a breathing B-roll panel in genuine background space.

## Typography

- Use a locally available font with the required language coverage.
- Use two type levels on ordinary frames and at most three on structured cards.
- Keep subtitles to one or two lines.
- Highlight only decisive words, not entire sentences.
- Use zero letter spacing unless the selected script requires spacing for legibility.
- Render cover text locally; never rely on generated image text.

## Color

When no brand palette exists, use:

- Near-black `#0B0D10`
- White `#F7F8FA`
- Signal blue `#2F7BFF`
- Warning orange `#FF6A2A`
- Muted gray `#9AA3AF`

Use blue for structure and conclusions, orange for conflict or warning, white for reading, and near-black for support surfaces. Do not turn every element into the accent color.

## Motion

- Animate entry and exit around the spoken word, not on arbitrary round seconds.
- Use fast, legible transforms: opacity, short translation, scale, mask reveal, or count-up.
- Keep ordinary transitions around 4-10 frames at 30 fps.
- Keep large beats long enough to read once, usually 1.0-2.8 seconds.
- Avoid constant floating, decorative particles, and unrelated parallax.
- Use sound effects sparingly on section changes, metrics, proof reveals, and the final verdict.

## B-Roll And Proof

Classify every asset:

- `proof`: real screen recording, screenshot, metric, document, or workflow state supporting the claim
- `illustration`: stock or recorded footage that clarifies a concept but proves nothing
- `generated`: synthetic imagery used only for illustration
- `none`: no asset required

Use selective B-roll on concrete nouns, environments, steps, infrastructure, and comparisons. Do not cover every sentence. Reject pseudo-text, distorted UI, unrelated people, and footage that could be mistaken for evidence.

## Subtitle Timing

- Segment by spoken thought, not fixed character count alone.
- Start near the first audible word and end before the next cue competes.
- Correct names, numbers, units, and product terms manually.
- Keep primary-language subtitles larger. Add a smaller translation only when it serves the audience.
- Do not lower source audio merely to make graphics feel more prominent.
