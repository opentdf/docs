#!/bin/bash

# Extract code resources from getting-started documentation
# This script extracts code blocks marked with comment markers (001-006)
# and saves them to the extracted-code directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "================================================"
echo "Code Resource Extractor"
echo "================================================"
echo ""
echo "Project root: $PROJECT_ROOT"
echo "Extracting resources 001-006 from getting-started guide..."
echo ""

# Run the Node.js extraction script
node "$SCRIPT_DIR/extract-code-resources.js"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "================================================"
  echo "✓ Extraction complete!"
  echo "================================================"
  echo ""
  echo "Extracted files are in: $PROJECT_ROOT/extracted-code"
  echo ""
  ls -lh "$PROJECT_ROOT/extracted-code"
else
  echo ""
  echo "================================================"
  echo "✗ Extraction failed with exit code $EXIT_CODE"
  echo "================================================"
  exit $EXIT_CODE
fi
