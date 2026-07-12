#!/bin/bash
# Launcher script for Precalc Tutor (macOS app bundle executable).
# Opens the HTML app embedded in this bundle's Resources folder.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HTML_FILE="$SCRIPT_DIR/Resources/Precalc Tutor.html"

# Ensure file exists
if [ ! -f "$HTML_FILE" ]; then
  /usr/bin/osascript -e 'display alert "Error" message "App file not found. Please reinstall."' 2>/dev/null
  exit 1
fi

# Open with Chrome if available, otherwise default browser
if [ -d "/Applications/Google Chrome.app" ]; then
  /usr/bin/open -a "Google Chrome" "$HTML_FILE"
else
  /usr/bin/open "$HTML_FILE"
fi

exit 0
