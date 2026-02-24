#!/usr/bin/env python3
"""
Generate Maia Bee sprite animations via PixelLab API.

Creates 3 animation states (idle, thinking, greeting) at 64x64 px,
saves individual frames + assembled GIF fallbacks.

Usage:
    python scripts/generate-maia-sprites.py
    python scripts/generate-maia-sprites.py --state idle  # Generate single state
    python scripts/generate-maia-sprites.py --gif-only     # Reassemble GIFs from existing frames
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

API_BASE = "https://api.pixellab.ai/v2"
API_KEY = os.environ.get(
    "PIXELLAB_API_KEY", "f1b30900-5ced-48a2-bb09-c90b6f949dd3"
)

# Paths (relative to this script's location -> website/)
SCRIPT_DIR = Path(__file__).resolve().parent
WEBSITE_DIR = SCRIPT_DIR.parent
REFERENCE_IMAGE = (
    WEBSITE_DIR / "client" / "src" / "assets" / "images" / "characters" / "maia-mascot-transparent.png"
)
OUTPUT_BASE = WEBSITE_DIR / "client" / "src" / "assets" / "animations" / "maia"

# Animation definitions: state -> (method, action/template, description)
ANIMATIONS = {
    "idle": {
        "method": "text",
        "action": "cute bee hovering with wings gently fluttering, pixel art style, warm gold and amber colors",
    },
    "thinking": {
        "method": "text",
        "action": "cute bee looking curious and thoughtful, antennae twitching, gentle bobbing motion",
    },
    "greeting": {
        "method": "text",
        "action": "cute bee excitedly flapping wings wide open, happy greeting wave, pixel art style, warm gold and amber colors",
    },
}

SIZE = 64  # PixelLab sweet spot
FRAME_DURATION_MS = 200  # 5 FPS


# ---------------------------------------------------------------------------
# API helpers
# ---------------------------------------------------------------------------

def get_headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }


def check_balance():
    resp = requests.get(f"{API_BASE}/balance", headers=get_headers(), timeout=30)
    resp.raise_for_status()
    data = resp.json()
    usd = data.get("credits", {}).get("usd", 0)
    gens = data.get("subscription", {}).get("generations", 0)
    print(f"Balance: ${usd:.2f} | Generations remaining: {gens}")
    return usd, gens


def encode_image(image_path: Path) -> dict:
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    return {"type": "base64", "base64": b64, "format": "png"}


def animate_with_text(reference_image: Path, action: str) -> dict:
    """Generate animation frames via text-driven endpoint."""
    payload = {
        "reference_image": encode_image(reference_image),
        "reference_image_size": {"width": SIZE, "height": SIZE},
        "image_size": {"width": SIZE, "height": SIZE},
        "action": action,
    }
    print(f"  Calling animate-with-text-v2: '{action[:60]}...'")
    resp = requests.post(
        f"{API_BASE}/animate-with-text-v2",
        headers=get_headers(),
        json=payload,
        timeout=180,
    )
    if resp.status_code != 200:
        raise Exception(f"API error {resp.status_code}: {resp.text[:500]}")
    return resp.json()


def create_character(reference_image: Path) -> str:
    """Create a PixelLab character for template-based animations. Returns character_id."""
    payload = {
        "image": encode_image(reference_image),
        "name": "maia-bee",
        "description": "A cute golden bee mascot with warm amber tones",
    }
    print("  Creating character for template animation...")
    resp = requests.post(
        f"{API_BASE}/characters",
        headers=get_headers(),
        json=payload,
        timeout=60,
    )
    if resp.status_code != 200:
        raise Exception(f"Character creation error {resp.status_code}: {resp.text[:500]}")
    data = resp.json()
    char_id = data.get("id") or data.get("character_id")
    if not char_id:
        raise Exception(f"No character_id in response: {json.dumps(data)[:300]}")
    print(f"  Character created: {char_id}")
    return char_id


def animate_character_template(character_id: str, template: str) -> dict:
    """Generate animation using a predefined template."""
    payload = {
        "character_id": character_id,
        "animation_template": template,
        "direction": "south",
    }
    print(f"  Calling animate-character with template: '{template}'")
    resp = requests.post(
        f"{API_BASE}/animate-character",
        headers=get_headers(),
        json=payload,
        timeout=180,
    )
    if resp.status_code != 200:
        raise Exception(f"API error {resp.status_code}: {resp.text[:500]}")
    return resp.json()


# ---------------------------------------------------------------------------
# Frame + GIF helpers
# ---------------------------------------------------------------------------

def save_frames(frames: list, output_dir: Path) -> list[Path]:
    """Save base64-encoded frames as frame_000.png ... frame_NNN.png."""
    output_dir.mkdir(parents=True, exist_ok=True)
    saved = []
    for i, frame_data in enumerate(frames):
        b64_str = frame_data.get("base64", "")
        if not b64_str:
            continue
        filepath = output_dir / f"frame_{i:03d}.png"
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(b64_str))
        saved.append(filepath)
    return saved


def assemble_gif(frame_dir: Path, output_path: Path, duration_ms: int = 200):
    """Assemble PNG frames into an animated GIF using Pillow."""
    try:
        from PIL import Image
    except ImportError:
        print("  [WARN] Pillow not installed -- skipping GIF assembly")
        print("  Install with: pip install Pillow")
        return False

    frames_paths = sorted(frame_dir.glob("frame_*.png"))
    if not frames_paths:
        print(f"  [WARN] No frames found in {frame_dir}")
        return False

    frames = []
    for fp in frames_paths:
        img = Image.open(fp).convert("RGBA")
        # Upscale with nearest-neighbor for crisp pixels
        img = img.resize((img.width * 4, img.height * 4), Image.NEAREST)
        frames.append(img)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=0,
        disposal=2,  # clear frame before drawing next
    )
    print(f"  GIF saved: {output_path} ({len(frames)} frames, {duration_ms}ms)")
    return True


# ---------------------------------------------------------------------------
# Main generation logic
# ---------------------------------------------------------------------------

def generate_state(state: str) -> list[Path]:
    """Generate animation frames for a single state."""
    config = ANIMATIONS[state]
    output_dir = OUTPUT_BASE / state

    print(f"\n--- Generating '{state}' animation ---")

    result = animate_with_text(REFERENCE_IMAGE, config["action"])

    # Extract frames
    frames = result.get("images", [])
    if not frames:
        print(f"  [ERROR] No frames returned for '{state}'")
        return []

    saved = save_frames(frames, output_dir)
    print(f"  Saved {len(saved)} frames to {output_dir}")

    # Report usage
    usage = result.get("usage", {})
    if usage:
        print(f"  Credits used: {usage.get('credits_used', 'N/A')}")

    return saved


def main():
    parser = argparse.ArgumentParser(description="Generate Maia bee sprite animations")
    parser.add_argument(
        "--state",
        choices=list(ANIMATIONS.keys()),
        help="Generate only this state (default: all)",
    )
    parser.add_argument(
        "--gif-only",
        action="store_true",
        help="Only reassemble GIFs from existing frames (no API calls)",
    )
    parser.add_argument(
        "--no-gif",
        action="store_true",
        help="Skip GIF assembly",
    )
    args = parser.parse_args()

    states = [args.state] if args.state else list(ANIMATIONS.keys())

    if not args.gif_only:
        # Verify reference image exists
        if not REFERENCE_IMAGE.exists():
            print(f"ERROR: Reference image not found: {REFERENCE_IMAGE}")
            return 1

        # Check balance
        print("Checking PixelLab balance...")
        usd, gens = check_balance()
        if gens < len(states):
            print(f"WARNING: Only {gens} generations remaining, need {len(states)}")

        # Generate each state
        for state in states:
            try:
                generate_state(state)
            except Exception as e:
                print(f"  [ERROR] Failed to generate '{state}': {e}")
                continue

    # Assemble GIFs
    if not args.no_gif:
        print("\n--- Assembling GIFs ---")
        for state in states:
            frame_dir = OUTPUT_BASE / state
            gif_path = OUTPUT_BASE / f"{state}.gif"
            assemble_gif(frame_dir, gif_path, FRAME_DURATION_MS)

    print("\nDone!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
