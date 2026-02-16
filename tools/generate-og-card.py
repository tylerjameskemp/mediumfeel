#!/usr/bin/env python3
"""
Generate a 1200x630 OG social card for a blog post.

Usage:
    python3 tools/generate-og-card.py <hero-image-path> <post-slug>

Example:
    python3 tools/generate-og-card.py assets/blog/my-post/hero.png my-post

This places the hero image centered on an amorphous green gradient
with the site's crosshatch line grid, and saves it to:
    assets/social/og-<post-slug>.png
"""

import sys
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

WIDTH, HEIGHT = 1200, 630

# Key colors from the green gradient
COLOR_LIME = np.array([173, 255, 47])       # #adff2f — bright center
COLOR_SPRING = np.array([124, 217, 46])     # #7cd92e
COLOR_GREEN = np.array([109, 179, 63])      # #6db33f
COLOR_MID = np.array([74, 143, 92])         # #4a8f5c
COLOR_DARK = np.array([45, 90, 61])         # #2d5a3d — edges


def lerp_color(c1, c2, t):
    """Linearly interpolate between two colors."""
    return (c1 * (1 - t) + c2 * t).astype(np.uint8)


def sample_gradient(t):
    """Map t (0=bright lime, 1=dark forest) to a color."""
    t = max(0.0, min(1.0, t))
    stops = [
        (0.00, COLOR_LIME),
        (0.20, COLOR_SPRING),
        (0.40, COLOR_GREEN),
        (0.65, COLOR_MID),
        (1.00, COLOR_DARK),
    ]
    for i in range(len(stops) - 1):
        if stops[i][0] <= t <= stops[i+1][0]:
            local_t = (t - stops[i][0]) / (stops[i+1][0] - stops[i][0])
            return lerp_color(stops[i][1], stops[i+1][1], local_t)
    return COLOR_DARK


def create_gradient(w, h):
    """Create an amorphous green gradient using overlapping elliptical blobs
    blurred together for a soft, organic look — no visible arcs or rings."""

    # Build a floating-point "brightness" field using multiple elliptical blobs
    # Each blob: (center_x, center_y, radius_x, radius_y, intensity)
    blobs = [
        (0.30, 0.40, 0.55, 0.70, 1.0),    # Large primary glow, left-center
        (0.72, 0.50, 0.40, 0.55, 0.85),    # Secondary glow, right
        (0.50, 0.75, 0.50, 0.40, 0.60),    # Bottom accent
        (0.15, 0.20, 0.30, 0.35, 0.50),    # Top-left subtle
        (0.85, 0.25, 0.25, 0.30, 0.40),    # Top-right subtle
    ]

    # Create coordinate grids
    xs = np.linspace(0, 1, w)
    ys = np.linspace(0, 1, h)
    xv, yv = np.meshgrid(xs, ys)

    # Accumulate brightness from all blobs
    brightness = np.zeros((h, w), dtype=np.float64)
    for cx, cy, rx, ry, intensity in blobs:
        # Elliptical distance (no circular rings — different x/y radii)
        dx = (xv - cx) / rx
        dy = (yv - cy) / ry
        dist_sq = dx * dx + dy * dy
        # Smooth gaussian falloff
        blob_val = intensity * np.exp(-dist_sq * 1.8)
        brightness += blob_val

    # Normalize to 0-1 range
    brightness = brightness / brightness.max()

    # Apply a smooth S-curve for more contrast between bright and dark zones
    # This pushes the midtones apart — brights get brighter, darks get darker
    brightness = 0.5 - 0.5 * np.cos(brightness * math.pi)

    # Map brightness → gradient color (0 = bright lime, 1 = dark forest)
    t_field = 1.0 - brightness  # invert: high brightness = low t = bright lime

    # Build the RGB image from the t_field
    pixels = np.zeros((h, w, 3), dtype=np.uint8)
    for y_idx in range(h):
        for x_idx in range(w):
            pixels[y_idx, x_idx] = sample_gradient(t_field[y_idx, x_idx])

    img = Image.fromarray(pixels, 'RGB').convert('RGBA')

    # Heavy gaussian blur to eliminate any remaining contour lines
    img = img.filter(ImageFilter.GaussianBlur(radius=30))

    # Crosshatch line grid (matches .bg-grid: 1px lines, 32px spacing)
    grid = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)
    for yy in range(0, h, 32):
        draw.line([(0, yy), (w, yy)], fill=(255, 255, 255, 40), width=1)
    for xx in range(0, w, 32):
        draw.line([(xx, 0), (xx, h)], fill=(255, 255, 255, 40), width=1)

    return Image.alpha_composite(img, grid)


def place_hero(bg, hero_path):
    hero = Image.open(hero_path).convert('RGBA')
    scale = min((bg.width * 0.5) / hero.width, 480 / hero.height)
    new_w, new_h = int(hero.width * scale), int(hero.height * scale)
    hero = hero.resize((new_w, new_h), Image.LANCZOS)
    x = (bg.width - new_w) // 2
    y = (bg.height - new_h) // 2
    bg.paste(hero, (x, y), hero)
    return bg


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    hero_path = Path(sys.argv[1])
    slug = sys.argv[2]

    if not hero_path.exists():
        print(f"Error: Hero image not found: {hero_path}")
        sys.exit(1)

    out_path = Path("assets/social") / f"og-{slug}.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Generating {out_path} ...")
    bg = create_gradient(WIDTH, HEIGHT)
    bg = place_hero(bg, str(hero_path))
    bg.convert('RGB').save(str(out_path), 'PNG')
    print(f"Done! Update your post's OG tags to point to:")
    print(f"  https://www.mediumfeel.com/{out_path}")


if __name__ == "__main__":
    main()
