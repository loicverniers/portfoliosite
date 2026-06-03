#!/bin/bash
# Screenshots for Schoonheidssalon Ingrid preview

PREVIEW_DIR=~/portfoliosite/temphost/schoonheidssalon-ingrid
SCREENSHOT_DIR=$PREVIEW_DIR/assets

mkdir -p $SCREENSHOT_DIR

echo "Taking desktop screenshot (1280x900)..."
chromium --no-sandbox \
    --disable-gpu \
    --screenshot=$SCREENSHOT_DIR/desktop.png \
    --window-size=1280,900 \
    "file://$PREVIEW_DIR/index.html" 2>/dev/null

sleep 2

echo "Taking mobile screenshot (390x844)..."
chromium --no-sandbox \
    --disable-gpu \
    --screenshot=$SCREENSHOT_DIR/mobile.png \
    --window-size=390,844 \
    "file://$PREVIEW_DIR/index.html" 2>/dev/null

sleep 2

echo "Done!"
ls -la $SCREENSHOT_DIR/
