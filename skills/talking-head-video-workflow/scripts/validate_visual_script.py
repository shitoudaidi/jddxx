#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

FUNCTIONS = {"hook", "explanation", "number", "comparison", "list", "proof", "step", "transition", "conclusion"}
TRACKS = {"A", "B", "full-screen-card"}
PROOF_TYPES = {"proof", "illustration", "generated", "none"}
REQUIRED = {"start", "end", "spoken", "function", "track", "visual_mode", "zone", "primary_visual", "subtitle", "proof_type", "asset", "risk"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a talking-head visual script.")
    parser.add_argument("visual_script", type=Path)
    args = parser.parse_args()

    try:
        data = json.loads(args.visual_script.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read visual script: {exc}")
        return 2

    errors = []
    warnings = []
    duration = data.get("duration")
    beats = data.get("beats")
    if not isinstance(duration, (int, float)) or duration <= 0:
        errors.append("duration must be a positive number")
    if not isinstance(beats, list) or not beats:
        errors.append("beats must be a non-empty list")
        beats = []

    previous_start = -1.0
    emphasis_time = 0.0
    for index, beat in enumerate(beats):
        label = f"beat[{index}]"
        if not isinstance(beat, dict):
            errors.append(f"{label} must be an object")
            continue
        missing = REQUIRED - beat.keys()
        if missing:
            errors.append(f"{label} missing fields: {', '.join(sorted(missing))}")
            continue
        start, end = beat["start"], beat["end"]
        if not isinstance(start, (int, float)) or not isinstance(end, (int, float)) or start < 0 or end <= start:
            errors.append(f"{label} has invalid start/end")
            continue
        if start < previous_start:
            errors.append(f"{label} is out of chronological order")
        previous_start = start
        if isinstance(duration, (int, float)) and duration > 0 and end > duration + 0.05:
            errors.append(f"{label} ends after video duration")
        if beat["function"] not in FUNCTIONS:
            errors.append(f"{label} has unknown function: {beat['function']}")
        if beat["track"] not in TRACKS:
            errors.append(f"{label} has unknown track: {beat['track']}")
        if beat["proof_type"] not in PROOF_TYPES:
            errors.append(f"{label} has unknown proof_type: {beat['proof_type']}")
        if beat["proof_type"] == "proof" and not beat["asset"]:
            errors.append(f"{label} is proof but has no asset")
        if beat["proof_type"] in {"illustration", "generated"} and beat["function"] == "proof":
            errors.append(f"{label} labels non-proof media as a proof beat")
        if not isinstance(beat["subtitle"], bool):
            errors.append(f"{label} subtitle must be true or false")
        if not str(beat["risk"]).strip():
            errors.append(f"{label} must state an overlap or interpretation risk")
        if beat["visual_mode"] != "none" or beat["track"] != "A":
            emphasis_time += end - start

    for left_index, left in enumerate(beats):
        if not isinstance(left, dict) or not REQUIRED.issubset(left):
            continue
        for right_index in range(left_index + 1, len(beats)):
            right = beats[right_index]
            if not isinstance(right, dict) or not REQUIRED.issubset(right):
                continue
            if right["start"] >= left["end"]:
                break
            if left["primary_visual"] != "none" and right["primary_visual"] != "none":
                errors.append(f"beat[{left_index}] and beat[{right_index}] overlap with two primary visuals")

    if isinstance(duration, (int, float)) and duration > 0:
        density = emphasis_time / duration
        if density > 0.40:
            warnings.append(f"high-emphasis density is {density:.0%}; review against the 25-35% guidance")
        if not any(beat.get("function") == "hook" and beat.get("start", 99) < 3 for beat in beats if isinstance(beat, dict)):
            warnings.append("no hook beat begins in the first three seconds")
        if not any(beat.get("function") == "conclusion" for beat in beats if isinstance(beat, dict)):
            warnings.append("no conclusion beat is defined")

    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    if errors:
        print(f"FAIL: {len(errors)} error(s), {len(warnings)} warning(s)")
        return 1
    print(f"PASS: {len(beats)} beat(s), {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
