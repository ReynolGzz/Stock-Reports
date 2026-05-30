#!/usr/bin/env python3
"""
Standalone test script for portfolio image extraction.
Usage: python extract_portfolio.py --image path/to/portfolio.png [--pretty]
"""
import anthropic
import argparse
import base64
import json
import os
import re
import sys
from pathlib import Path

EXTRACTION_PROMPT = """Extract all stock positions from this portfolio screenshot.
Return ONLY a valid JSON array, no markdown fences, no explanation:
[{"ticker":"AAPL","company":"Apple Inc.","shares":10,"avg_cost":150.00,
  "current_price":185.00,"market_value":1850.00,"gain_loss":350.00,"gain_loss_pct":23.33}]
Set any missing field to null. Include every visible position."""

MIME_MAP = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp",
}


def extract_portfolio(image_path: str) -> list:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    img = Path(image_path)
    if not img.exists():
        print(f"ERROR: File not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    mime_type = MIME_MAP.get(img.suffix.lower(), "image/jpeg")
    image_data = base64.standard_b64encode(img.read_bytes()).decode("utf-8")

    print(f"Sending {img.name} to claude-haiku-4-5...", flush=True)

    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": mime_type, "data": image_data},
                },
                {"type": "text", "text": EXTRACTION_PROMPT},
            ],
        }],
    )

    text = "".join(b.text for b in response.content if b.type == "text")
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    json_str = match.group(1) if match else text.strip()
    return json.loads(json_str)


def main():
    parser = argparse.ArgumentParser(description="Extract portfolio positions from an image")
    parser.add_argument("--image", required=True, help="Path to portfolio screenshot")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")
    args = parser.parse_args()

    positions = extract_portfolio(args.image)
    print(json.dumps(positions, indent=2 if args.pretty else None))

    total_value = sum(p.get("market_value") or 0 for p in positions)
    total_gl = sum(p.get("gain_loss") or 0 for p in positions)
    print(f"\n--- Summary ---", file=sys.stderr)
    print(f"Positions : {len(positions)}", file=sys.stderr)
    print(f"Total value: ${total_value:,.2f}", file=sys.stderr)
    print(f"Total P&L  : ${total_gl:+,.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
