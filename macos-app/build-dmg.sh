#!/bin/bash
# Build the macOS DMG for Precalc Tutor.
# Web app -> .app bundle -> compressed drag-install .dmg
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB="$HERE/../highschool-precalculus-tutor"
APP_NAME="Precalc Tutor"
VERSION="$(node -p "require('$WEB/package.json').version")"
STAGING="$HERE/release/staging"
APP="$STAGING/$APP_NAME.app"
DMG="$HERE/release/Precalc-Tutor-$VERSION.dmg"

echo "==> Building web app (v$VERSION)"
cd "$WEB"
[ -d node_modules ] || npm install
npm run build   # -> dist/index.html (single self-contained file)

echo "==> Assembling $APP_NAME.app"
rm -rf "$STAGING"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$HERE/dmg-app/Info.plist" "$APP/Contents/Info.plist"
cp "$HERE/dmg-app/Launcher.sh" "$APP/Contents/MacOS/Launcher"
chmod +x "$APP/Contents/MacOS/Launcher"
cp "$WEB/dist/index.html" "$APP/Contents/Resources/$APP_NAME.html"
echo "APPL????" > "$APP/Contents/PkgInfo"
ln -s /Applications "$STAGING/Applications"

echo "==> Creating DMG"
mkdir -p "$HERE/release"
rm -f "$DMG"
hdiutil create -volname "$APP_NAME" -srcfolder "$STAGING" -ov -format UDZO "$DMG"
rm -rf "$STAGING"

echo "==> Done: $DMG"
