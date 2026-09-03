"""Restore and resize product images without adding backgrounds."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

MAX_SIZE = 1024
PRODUCTS_DIR = Path(__file__).resolve().parent.parent / "public" / "products"
ASSETS_DIR = Path(__file__).resolve().parent.parent / "assets"

ASSET_SUFFIXES = {
    "egyptian-vanity-mirror-comb-set.jpg": "images_5-897323b6-ca27-49fd-9c6e-818abaa66cfb.jpg",
    "tutankhamun-mask-papyrus-art.jpg": "images_7-ab2d0252-ca5b-42d5-a7a1-fe1c4782eca6.jpg",
    "ornate-egyptian-ankh.jpg": "images_8-97b8309f-67b6-47a6-bbe0-06d7629fc180.jpg",
    "eye-of-horus-phone-charm.jpg": "images_3-bc5cdd27-a57e-45b7-a59d-7f5f14fbe6d4.jpg",
    "egyptian-apple-watch-charm-set.jpg": "images_4-8a02d8bc-f16b-471a-aeff-1ab597538fbb.jpg",
    "pharaoh-scarf.jpg": "images_9-99b424c3-f12c-44a1-862a-c5d95ccc2422.jpg",
    "nefertiti-profile-papyrus-art.jpg": "images_6-d89bb1c1-d053-44b7-a287-27b8447dea30.jpg",
    "pyramid-trinket-box-set.jpg": "images_10-5fe9792b-d4f6-44b9-a3ca-fccfa1d86023.jpg",
    "winged-scarab-jewelry-set.jpg": "images_2-dadef991-2f2c-4d95-978a-0540071972d2.jpg",
    "pharaoh-hieroglyph-bookmark.jpg": "images_1-7214099b-1b96-4abe-a14d-4160dc1c72c8.jpg",
    "nile-valley-woven-rug.jpg": "images_11-3c51cde1-ad7b-4beb-a2c9-c0fee23431c8.jpg",
}


def restore_from_assets(filename: str) -> None:
    suffix = ASSET_SUFFIXES[filename]
    for asset in ASSETS_DIR.glob(f"c__Users_*{suffix}"):
        (PRODUCTS_DIR / filename).write_bytes(asset.read_bytes())
        print(f"restored {filename}")
        return
    raise FileNotFoundError(f"Original asset not found for {filename}")


def resize_suitable(source: Path) -> tuple[int, int]:
    with Image.open(source) as img:
        rgb = img.convert("RGB")
        width, height = rgb.size
        scale = min(1.0, MAX_SIZE / max(width, height))
        new_size = (
            max(1, round(width * scale)),
            max(1, round(height * scale)),
        )

        if new_size != (width, height):
            rgb = rgb.resize(new_size, Image.Resampling.LANCZOS)

        rgb.save(source, "JPEG", quality=92, optimize=True)
        print(f"saved {source.name} -> {new_size[0]}x{new_size[1]}")
        return new_size


def main() -> int:
    if not PRODUCTS_DIR.exists():
        PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)

    targets = sys.argv[1:] or list(ASSET_SUFFIXES.keys())

    for filename in targets:
        restore_from_assets(filename)
        resize_suitable(PRODUCTS_DIR / filename)

    print(f"Done. Updated {len(targets)} image(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
