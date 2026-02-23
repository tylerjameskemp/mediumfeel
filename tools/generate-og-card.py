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

# Colors matching the CSS radial-gradient stops in blog-design-system.css
# radial-gradient(ellipse 150% 120% at 30% 50%,
#   #2d5a3d 0%, #3a6b47 15%, #4a8f5c 25%,
#   #6db33f 35%, #7cd92e 45%, #adff2f 50%,
#   #7cd92e 55%, #6db33f 65%, #4a8f5c 75%,
#   #3a6b47 85%, #2d5a3d 100%)
GRADIENT_COLORS = [
    (0.00, np.array([45, 90, 61])),      # #2d5a3d
    (0.15, np.array([58, 107, 71])),     # #3a6b47
    (0.25, np.array([74, 143, 92])),     # #4a8f5c
    (0.35, np.array([109, 179, 63])),    # #6db33f
    (0.45, np.array([124, 217, 46])),    # #7cd92e
    (0.50, np.array([173, 255, 47])),    # #adff2f — brightest
    (0.55, np.array([124, 217, 46])),    # #7cd92e
    (0.65, np.array([109, 179, 63])),    # #6db33f
    (0.75, np.array([74, 143, 92])),     # #4a8f5c
    (0.85, np.array([58, 107, 71])),     # #3a6b47
    (1.00, np.array([45, 90, 61])),      # #2d5a3d
]


def sample_gradient(t):
    """Map t (0.0–1.0) through the CSS gradient stops."""
    t = max(0.0, min(1.0, t))
    for i in range(len(GRADIENT_COLORS) - 1):
        t0, c0 = GRADIENT_COLORS[i]
        t1, c1 = GRADIENT_COLORS[i + 1]
        if t0 <= t <= t1:
            local = (t - t0) / (t1 - t0)
            return (c0 * (1 - local) + c1 * local).astype(np.uint8)
    return GRADIENT_COLORS[-1][1]


def create_gradient(w, h):
    """Replicate the CSS elliptical radial-gradient as closely as possible,
    then blur to keep it amorphous with no visible arcs."""

    # The CSS is: radial-gradient(ellipse 150% 120% at 30% 50%, ...)
    # "150% 120%" means the ellipse radii are 1.5× width and 1.2× height
    # "at 30% 50%" is the center point
    cx, cy = 0.30, 0.50
    # Radii as fractions of the image (CSS % of element size)
    rx, ry = 1.50, 1.20

    # Create coordinate grids
    xs = np.linspace(0, 1, w)
    ys = np.linspace(0, 1, h)
    xv, yv = np.meshgrid(xs, ys)

    # Elliptical distance from center — matches CSS radial-gradient geometry
    dx = (xv - cx) / rx
    dy = (yv - cy) / ry
    dist = np.sqrt(dx * dx + dy * dy)

    # dist=0 at center (brightest, t=0.50), dist=1 at ellipse edge (t=0 or 1)
    # The CSS gradient maps center→#adff2f and edge→#2d5a3d
    # We map dist 0→0.50 (center of gradient) and dist 1→1.0 (edge)
    # For distances > 1, clamp to edge color
    t_field = 0.50 + dist * 0.50
    t_field = np.clip(t_field, 0.0, 1.0)

    # Build the RGB image
    pixels = np.zeros((h, w, 3), dtype=np.uint8)
    for y_idx in range(h):
        for x_idx in range(w):
            pixels[y_idx, x_idx] = sample_gradient(t_field[y_idx, x_idx])

    img = Image.fromarray(pixels, 'RGB').convert('RGBA')

    # Moderate blur to soften the gradient and prevent banding
    img = img.filter(ImageFilter.GaussianBlur(radius=12))

    # Crosshatch grid — lime-tinted to match the CSS
    # CSS uses: rgba(173, 255, 47, 0.3) for grid lines
    grid = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)
    for yy in range(0, h, 32):
        draw.line([(0, yy), (w, yy)], fill=(173, 255, 47, 45), width=1)
    for xx in range(0, w, 32):
        draw.line([(xx, 0), (xx, h)], fill=(173, 255, 47, 45), width=1)

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
    print(f"  https://mediumfeel.com/{out_path}")


if __name__ == "__main__":
    main()
