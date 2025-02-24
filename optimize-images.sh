#!/bin/bash

# Configuration
CPU="${CPU:-16}"                # Number of parallel processes
MAIN_DIR="./public/berserk"     # Original images directory
THUMB_DIR="./public/thumbnails" # Thumbnails directory

# Quality Settings
MAIN_QUALITY=50  # WebP quality for main images
THUMB_QUALITY=10 # WebP quality for thumbnails
MAIN_WIDTH=800   # Main image max width
THUMB_WIDTH=100  # Thumbnail max width

# ------------------------------------------------------------------------------
# Functions
# ------------------------------------------------------------------------------

# Process a single image (resize + convert to WebP without modifying originals)
process_image() {
  local src="$1"
  local quality="$2"
  local max_width="$3"
  local webp_dest="${src%.*}.webp"

  # Create WebP version without altering original
  magick "$src" -resize "${max_width}>" -strip -quality 100 "$webp_dest"
  cwebp -q "$quality" -m 6 -sharp_yuv "$webp_dest" -o "$webp_dest"
}

# Generate thumbnail version from original
generate_thumbnail() {
  local src="$1"
  local rel_path="${src#$MAIN_DIR/}"
  local thumb_dest="$THUMB_DIR/${rel_path%.*}.webp"

  mkdir -p "$(dirname "$thumb_dest")"
  magick "$src" -resize "${THUMB_WIDTH}>" -strip -quality "$THUMB_QUALITY" "$thumb_dest"
}

# ------------------------------------------------------------------------------
# Main Script
# ------------------------------------------------------------------------------

# Create directories if they don't exist
mkdir -p "$THUMB_DIR"

# Step 1: Create thumbnails from originals
export -f generate_thumbnail
export MAIN_DIR THUMB_DIR THUMB_WIDTH THUMB_QUALITY
find "$MAIN_DIR" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 |
  xargs -0 -P "$CPU" -I {} bash -c 'generate_thumbnail "$@"' _ {}

# Step 2: Create optimized WebP versions (keep originals)
export -f process_image
export MAIN_QUALITY MAIN_WIDTH
find "$MAIN_DIR" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 |
  xargs -0 -P "$CPU" -I {} bash -c 'process_image "$@" $MAIN_QUALITY $MAIN_WIDTH' _ {}

# Final size report
echo -e "\nMain images size (WebP versions):"
find "$MAIN_DIR" -name '*.webp' -exec du -ch {} + | grep total
echo "Thumbnails size:"
find "$THUMB_DIR" -name '*.webp' -exec du -ch {} + | grep total

# script by deepseek-r1 my goat
