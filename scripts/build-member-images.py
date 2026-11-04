"""Online member banner + clean Offline variant."""
from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFont

src = Path(
    r"C:\Users\lekst\.cursor\projects\c-Users-lekst-Boostdockwebsitefull\assets"
    r"\Online_Members_Banner-d5f24682-c529-45d7-a3c5-0dbd78903bfd.jpg"
)
out = Path(__file__).resolve().parents[1] / "assets" / "products"
out.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGB")
w, h = im.size

im.save(out / "members-online.webp", "WEBP", quality=92)
print("wrote members-online.webp")

offline = im.copy()
draw = ImageDraw.Draw(offline)

# Mask old "ONLINE / MEMBERS" label (keep icon above)
y0 = int(h * 0.505)
y1 = h
# Soft top edge: blend a few rows into the artwork
for row in range(12):
    y = y0 + row
    t = row / 11
    for x in range(w):
        r, g, b = offline.getpixel((x, y))
        br, bg, bb = 6, 6, 8
        offline.putpixel(
            (x, y),
            (
                int(r * (1 - t) + br * t),
                int(g * (1 - t) + bg * t),
                int(b * (1 - t) + bb * t),
            ),
        )
draw.rectangle([0, y0 + 12, w, y1], fill=(6, 6, 8))

random.seed(7)
for _ in range(200):
    px = random.randint(0, w - 1)
    py = random.randint(y0 + 12, y1 - 1)
    v = random.randint(140, 255)
    offline.putpixel((px, py), (v, v, v))

draw = ImageDraw.Draw(offline)

try:
    font_off = ImageFont.truetype("arialbd.ttf", int(h * 0.062))
    font_mem = ImageFont.truetype("arialbd.ttf", int(h * 0.07))
except OSError:
    font_off = font_mem = ImageFont.load_default()


def glow(text, font, cy):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (w - tw) / 2
    ty = cy - th / 2 - bbox[1]
    for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
        draw.text((tx + dx, ty + dy), text, fill=(0, 0, 0), font=font)
    draw.text((tx, ty), text, fill=(255, 255, 255), font=font)


cy = y0 + (y1 - y0) * 0.48
glow("OFFLINE", font_off, cy)
glow("MEMBERS", font_mem, cy + h * 0.105)

offline.save(out / "members-offline.webp", "WEBP", quality=92)
print("wrote members-offline.webp")
