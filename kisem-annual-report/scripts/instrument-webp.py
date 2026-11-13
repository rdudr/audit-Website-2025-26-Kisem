"""Make the small WebP copies of the instrument photos the site shows.

    python scripts/instrument-webp.py

Reads public/instruments/*.png (1.3-1.6 MB each) and writes public/instruments/webp/<same name>.webp,
at most 800 px wide, aiming under 80 KB. The PNGs stay as the fallback in <picture>. Needs Pillow;
it is a one-off tool, nothing the website itself loads.
"""
from pathlib import Path
from PIL import Image

src = Path(__file__).resolve().parent.parent / 'public' / 'instruments'
out = src / 'webp'
out.mkdir(exist_ok=True)
for png in sorted(src.glob('*.png')):
    im = Image.open(png)
    im = im.convert('RGBA') if im.mode in ('P', 'LA') else im
    if im.width > 800:
        im = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
    dest = out / (png.stem + '.webp')
    for q in (80, 72, 64, 56, 48):
        im.save(dest, 'WEBP', quality=q, method=6)
        if dest.stat().st_size <= 80_000:
            break
    print(f'{dest.name}: {dest.stat().st_size // 1024} KB ({im.width}x{im.height}, from {png.stat().st_size // 1024} KB)')
