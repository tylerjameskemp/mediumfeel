#!/usr/bin/env python3
"""
Generate a 1200x630 OG social card for a blog post.

Usage:
    python3 tools/generate-og-card.py <hero-image-path> <post-slug>

Example:
    python3 tools/generate-og-card.py assets/blog/my-post/hero.png my-post

This places the hero image centered on the green post-header gradient
with the site's crosshatch line grid, and saves it to:
    assets/social/og-<post-slug>.png
"""

import sys
import math
from pathlib import Path
from PIL import Image, ImageDraw

WIDTH, HEIGHT = 1200, 630

# Green radial gradient matching .post-header in blog posts
GRADIENT_STOPS = [
    (0.00, (45, 90, 61)),    # #2d5a3d
    (0.15, (58, 107, 71)),   # #3a6b47
    (0.25, (74, 143, 92)),   # #4a8f5c
    (0.35, (109, 179, 63)),  # #6db33f
    (0.45, (124, 217, 46)),  # #7cd92e
    (0.50, (173, 255, 47)),  # #adff2f
    (0.55, (124, 217, 46)),  # #7cd92e
    (0.65, (109, 179, 63)),  # #6db33f
    (0.75, (74, 143, 92)),   # #4a8f5c
    (0.85, (58, 107, 71)),   # #3a6b47
    (1.00, (45, 90, 61)),    # #2d5a3d
]


def create_gradient(w, h):
    img = Image.new('RGBA', (w, h))
    cx, cy = int(w * 0.3), int(h * 0.5)
    max_r = math.sqrt((w * 1.5)**2 + (h * 1.2)**2) / 2

    pixels = img.load()
    for y in range(h):
        for x in range(w):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            t = min(dist / max_r, 1.0)
            for i in range(len(GRADIENT_STOPS) - 1):
                if GRADIENT_STOPS[i][0] <= t <= GRADIENT_STOPS[i+1][0]:
                    t_local = (t - GRADIENT_STOPS[i][0]) / (GRADIENT_STOPS[i+1][0] - GRADIENT_STOPS[i][0])
                    r = int(GRADIENT_STOPS[i][1][0] + (GRADIENT_STOPS[i+1][1][0] - GRADIENT_STOPS[i][1][0]) * t_local)
                    g = int(GRADIENT_STOPS[i][1][1] + (GRADIENT_STOPS[i+1][1][1] - GRADIENT_STOPS[i][1][1]) * t_local)
                    b = int(GRADIENT_STOPS[i][1][2] + (GRADIENT_STOPS[i+1][1][2] - GRADIENT_STOPS[i][1][2]) * t_local)
                    pixels[x, y] = (r, g, b, 255)
                    break

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
