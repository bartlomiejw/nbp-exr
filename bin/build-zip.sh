#!/usr/bin/env bash
#
# Builds a distributable plugin zip (build/nbp-exr-<version>.zip) containing
# only runtime files. Expects the front-end to be built (npm run build).
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="nbp-exr"
BUILD_DIR="$ROOT/build"
VERSION="$(sed -n 's/^ \* Version: *//p' "$ROOT/$SLUG.php" | tr -d '[:space:]')"

if [[ -z "$VERSION" ]]; then
	echo "Could not read the plugin version from $SLUG.php" >&2
	exit 1
fi

if [[ ! -f "$ROOT/public/manifest.json" ]]; then
	echo "public/manifest.json is missing. Run 'npm run build' first." >&2
	exit 1
fi

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/$SLUG"

rsync -a --exclude-from="$ROOT/.distignore" "$ROOT/" "$BUILD_DIR/$SLUG/"

for required in "$SLUG.php" uninstall.php readme.txt LICENSE includes/Plugin.php public/manifest.json languages/$SLUG-pl_PL.mo; do
	if [[ ! -e "$BUILD_DIR/$SLUG/$required" ]]; then
		echo "Missing $required in the package." >&2
		exit 1
	fi
done

ZIP="$BUILD_DIR/$SLUG-$VERSION.zip"
(cd "$BUILD_DIR" && zip -rqX "$ZIP" "$SLUG")

echo "Created ${ZIP#"$ROOT"/}"
