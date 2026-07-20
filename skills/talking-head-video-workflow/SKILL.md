---
name: talking-head-video-workflow
description: Turn raw talking-head or spoken-camera footage into a polished knowledge video with timed subtitles, restrained motion graphics, selective B-roll, proof-aware assets, a deterministic cover, frame review, and a publish package. Use when the user provides or points to a recorded monologue and asks to edit, package, reproduce, or standardize a short-form or landscape talking-head video. Also use when creating a reusable production workflow from spoken footage. Do not use for faceless montage videos, fictional films, music videos, or script-only requests that do not include production.
---

# Talking-Head Video Workflow

Produce a complete, reviewed video from recorded speech. Preserve the speaker as the trust layer; use graphics only to improve comprehension, proof, rhythm, or recall.

## Required Inputs

Locate or request only inputs that cannot be inferred:

- Source video or audio
- Intended platform or aspect ratio; default to the source ratio
- Language and subtitle preference; default to primary-language subtitles
- Brand assets or palette; default to the neutral system in `references/visual-system.md`
- Claims that require proof and their real screenshots, recordings, or sources

Do not require a finished script. Transcribe the recording when only media is provided.

## Start The Project

Run:

```bash
python scripts/init_video_project.py <project-dir> --source <media-path> --ratio 9:16
```

This creates the intermediate artifacts required by the workflow. Do not render before the visual script and asset manifest exist.

## Required Workflow

Follow these gates in order:

1. **Inspect**: probe duration, dimensions, frame rate, audio, and source readability. Preserve an untouched source.
2. **Transcribe**: create sentence-level timestamps. Correct names, numbers, and technical terms against the audio.
3. **Structure**: identify the hook, sections, proof beats, comparisons, steps, and final judgment. Do not silently rewrite the speaker's claim.
4. **Write the text-only visual script**: map time ranges to A-track, B-track, subtitle, visual function, zone, asset dependency, and overlap risk.
5. **Check assets and proof**: classify every asset as `proof`, `illustration`, `generated`, or `none`. Never present illustration as evidence.
6. **Build**: implement the video with data-driven timing. Keep source media, cue data, and visual components separate.
7. **Validate the plan**: run `python scripts/validate_visual_script.py <project-dir>/visual-script.json` and fix every error.
8. **Render a draft**: render the full duration, not only a preview segment.
9. **Review frames and timing**: extract the hook, every visual transition, representative clean A-track frames, and the ending. Inspect the contact sheet and spot-check motion around transitions.
10. **Revise and render final**: address observed issues; do not approve by intuition alone.
11. **Create cover and publish package**: generate imagery without text when needed, then add all final typography locally and deterministically.
12. **Record a postmortem**: capture repeated problems as a component, script, checklist, or skill update.

For exact layout, density, motion, subtitle, and aspect-ratio rules, read `references/visual-system.md` before writing the visual script.
For artifacts and acceptance criteria, read `references/delivery-contract.md` before rendering.

## Visual Script Contract

Use `assets/visual-script.example.json` as the schema example. Each beat must contain:

- `start`, `end`, and exact `spoken` idea
- `function`: `hook`, `explanation`, `number`, `comparison`, `list`, `proof`, `step`, `transition`, or `conclusion`
- `track`: `A`, `B`, or `full-screen-card`
- `visual_mode` and `zone`
- `primary_visual`: one identifier or `none`
- `subtitle`: whether the baseline subtitle remains visible
- `proof_type`, `asset`, and explicit `risk`

Use `none` deliberately. A clean speaker frame is a valid visual decision.

## Non-Negotiable Rules

- Keep one primary visual per frame.
- Keep the speaker's eyes, nose, mouth, and meaningful hand gestures clear.
- Treat subtitles as the continuous comprehension layer, not a second headline.
- Use emphasis only for hooks, numbers, comparisons, steps, proof, and conclusions.
- Keep most emphasis bursts between 1.0 and 2.8 seconds.
- Return to clean A-track after a burst unless the next beat requires stronger support.
- Do not use fake screenshots, fake metrics, fake interfaces, or unverified claims.
- Do not use stock or generated footage as proof.
- Do not leave template text, unrelated graphics, watermarks, or placeholder assets.
- Do not ship model-generated Chinese or other complex-script cover text; typeset it locally.
- Do not call a video finished until the output exists and frames were inspected.

## Implementation Guidance

Prefer a timeline-driven renderer such as Remotion when code production is available. Use a proven transcription engine and FFmpeg for media probing, normalization, frame extraction, and contact sheets. Reuse the repository's existing stack when working inside an established project.

Keep these boundaries:

- Data file: source path, duration, transcript cues, visual beats, asset paths
- Components: subtitle, keyword emphasis, metric, comparison, checklist, proof, B-roll, verdict
- Composition: selects active cues and layers; it must not contain transcript prose inline
- Review output: extracted frames, contact sheet, and written findings

## Failure Handling

- If transcription confidence is low, mark uncertain words and verify them before visual design.
- If the face position changes, derive safe zones from sampled frames instead of assuming a fixed side.
- If proof is missing, keep the speaker visible or reframe the beat; do not fabricate support.
- If an asset is semantically weak, remove it. Empty visual space is better than misleading filler.
- If a render fails, preserve logs, fix the smallest cause, and rerun the full validation path.

## Output Contract

Deliver:

- Final rendered video
- Cover with deterministic typography
- Transcript and text-only visual script
- Asset/proof manifest
- Review frames or contact sheet plus review notes
- Title, description, hashtags, core takeaway, and optional pinned comment
- Postmortem with at least one reusable lesson when meaningful

Report what changed, what was verified, remaining uncertainty, and exact output paths.
