# Brand assets

Source artwork lives in `assets/` and is not served — only `public/` is. The
files the app actually loads are generated from it:

| Source | Generated | Size |
|---|---|---|
| `assets/logo-icon.png` | `public/brand/sedra-mark.png` | 167x320, ~19KB |
| `assets/brand-name.png` | `public/brand/sedra-wordmark.png` | 1068x241, ~131KB |
| `assets/logo-icon.png` | `app/icon.png`, `app/apple-icon.png` | 512 and 180 square |

Two things had to be fixed on the way in:

**The wordmark had no transparency.** `assets/brand-name.png` is an opaque
1254x1254 image with a baked-in checkerboard behind the letters, so dropping it
straight in put a white square on every dark surface. The background was keyed
out by luminance: measured, it sits at 241.5-255 while the artwork runs 25-150,
so the key ramps from fully opaque at 200 to fully clear at 238. That gap is
wide enough to keep anti-aliased letter edges soft and leave no halo.

**Both were oversized.** 2.4MB combined, on images marked `priority`. They are
now trimmed to their content bounding box and resized for 2x display.

To regenerate after replacing the source art, run `scripts/build-brand-assets.mjs`.
