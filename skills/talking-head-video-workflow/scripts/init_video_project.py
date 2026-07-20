#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def write_new(path: Path, content: str) -> None:
    if path.exists():
        print(f"skip existing: {path}")
        return
    path.write_text(content, encoding="utf-8")
    print(f"created: {path}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize a talking-head video production workspace.")
    parser.add_argument("project_dir", type=Path)
    parser.add_argument("--source", required=True)
    parser.add_argument("--ratio", choices=("9:16", "16:9", "1:1", "4:5"), default="9:16")
    args = parser.parse_args()

    root = args.project_dir.resolve()
    for name in ("inputs", "assets", "renders", "review"):
        (root / name).mkdir(parents=True, exist_ok=True)

    brief = f"""# Production Brief

Goal:
Audience:
Constraints:
Proof standard:

Source: `{args.source}`
Aspect ratio: `{args.ratio}`
"""
    visual = {
        "version": 1,
        "source": args.source,
        "duration": 0,
        "ratio": args.ratio,
        "beats": [],
    }
    manifest = {"version": 1, "assets": []}

    write_new(root / "brief.md", brief)
    write_new(root / "transcript.json", json.dumps({"version": 1, "cues": []}, indent=2) + "\n")
    write_new(root / "visual-script.json", json.dumps(visual, indent=2) + "\n")
    write_new(root / "asset-manifest.json", json.dumps(manifest, indent=2) + "\n")
    write_new(root / "review.md", "# Review\n\n## Observed\n\n## Fixed\n\n## Remaining Uncertainty\n")
    write_new(root / "publish-package.md", "# Publish Package\n\nTitle:\nCover line:\nDescription:\nHashtags:\nCore takeaway:\nPinned comment:\n")
    write_new(root / "postmortem.md", "# Postmortem\n\nWhat worked:\nWhat failed:\nFriction:\nReusable improvement:\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
