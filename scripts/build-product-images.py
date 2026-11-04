"""Convert source product JPGs to WebP (no overlays or price bands)."""
from pathlib import Path

from PIL import Image

src = Path(r"C:\Users\lekst\.cursor\projects\c-Users-lekst-Boostdockwebsitefull\assets")
out = Path(__file__).resolve().parents[1] / "assets" / "products"
out.mkdir(parents=True, exist_ok=True)

items = [
    ("Hns4Q__1_-6185ffd4-98d4-4fa5-9195-d576d458a6c7.jpg", "boost-1.webp"),
    ("MyWoV__1_-3ced0fe7-78aa-46e0-859a-a2a74bf3ac90.jpg", "boost-5.webp"),
    ("YT1Nn__1_-ea91ec4d-bc37-4d05-9e84-a5a5d305f35e.jpg", "boost-10.webp"),
    ("cHxTP__1_-6067c3ed-203f-4ad5-b924-7310ccddc269.jpg", "boost-15.webp"),
    ("cHxTP__1_-6067c3ed-203f-4ad5-b924-7310ccddc269.jpg", "boost-20.webp"),
]

for src_name, dest_name in items:
    im = Image.open(src / src_name).convert("RGB")
    im.save(out / dest_name, "WEBP", quality=92)
    print("wrote", dest_name)
