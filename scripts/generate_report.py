#!/usr/bin/env python3
"""
Reymen Analytics — Daily stock report generator.
Calls the Anthropic Claude API with web search, extracts the HTML
output, and saves it to reports/YYYY-MM-DD.html.
"""

import anthropic
import json
import os
import re
import sys
from datetime import date, datetime, timezone
from pathlib import Path


def extract_html(content_blocks) -> str:
    """Extract the HTML document from API response content blocks."""
    text_parts = [
        block.text
        for block in content_blocks
        if hasattr(block, "text") and block.type == "text"
    ]
    raw = "\n".join(text_parts).strip()

    match = re.search(r"```(?:html)?\s*\n(.*?)\n```", raw, re.DOTALL)
    if match:
        return match.group(1).strip()

    for marker in ("<!DOCTYPE", "<!doctype", "<html", "<HTML"):
        idx = raw.find(marker)
        if idx != -1:
            end = raw.lower().rfind("</html>")
            return raw[idx : end + len("</html>")] if end != -1 else raw[idx:]

    return raw


def generate_report(prompt: str) -> str:
    client = anthropic.Anthropic()
    tools = [{"type": "web_search_20250305", "name": "web_search", "max_uses": 12}]
    messages = [{"role": "user", "content": prompt}]
    max_iter = 30

    for iteration in range(1, max_iter + 1):
        ts = datetime.now(timezone.utc).strftime("%H:%M:%S")
        print(f"[{ts}] API call #{iteration}…", flush=True)

        response = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=16000,
            tools=tools,
            messages=messages,
        )

        block_types = [getattr(b, "type", "?") for b in response.content]
        print(f"  stop_reason={response.stop_reason!r}  blocks={block_types}", flush=True)

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            html = extract_html(response.content)
            if len(html) < 200:
                print(
                    f"WARNING: HTML output is very short ({len(html)} chars). "
                    f"Preview:\n{html[:300]}",
                    file=sys.stderr,
                )
            return html

        if response.stop_reason == "pause_turn":
            continue

        if response.stop_reason == "max_tokens":
            raise RuntimeError(
                "Claude reached max_tokens before completing the report. "
                "Increase max_tokens, reduce prompt size, or use a stronger model."
            )

        raise RuntimeError(f"Unexpected stop_reason: {response.stop_reason!r}")

    raise RuntimeError(f"Reached max iterations ({max_iter}) without end_turn")


def update_manifest(today_str: str, reports_dir: Path) -> None:
    manifest_path = reports_dir / "manifest.json"
    if manifest_path.exists():
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        data = {"reports": []}

    if today_str not in data["reports"]:
        data["reports"].insert(0, today_str)

    manifest_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Manifest updated → {data['reports'][:5]}", flush=True)


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    today_str = date.today().isoformat()
    repo_root = Path(__file__).resolve().parent.parent
    reports_dir = repo_root / "reports"
    reports_dir.mkdir(exist_ok=True)

    report_path = reports_dir / f"{today_str}.html"
    prompt_path = Path(__file__).resolve().parent / "prompt.md"

    if not prompt_path.exists():
        print(f"ERROR: Prompt file not found: {prompt_path}", file=sys.stderr)
        sys.exit(1)

    prompt = prompt_path.read_text(encoding="utf-8")
    print(f"Generating report for {today_str} (prompt: {len(prompt):,} chars)…", flush=True)

    try:
        html = generate_report(prompt)
    except anthropic.APIError as exc:
        print(f"ERROR: Anthropic API error: {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)

    report_path.write_text(html, encoding="utf-8")
    print(f"Report saved → {report_path} ({len(html):,} chars)", flush=True)

    update_manifest(today_str, reports_dir)
    print("Done.", flush=True)


if __name__ == "__main__":
    main()
