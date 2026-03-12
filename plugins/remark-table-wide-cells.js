/**
 * Remark plugin that detects table columns with long text content
 * and tags all cells in those columns with a `wide-cell` CSS class.
 *
 * This enables targeted CSS word-wrapping on only the columns that need it,
 * keeping short columns compact.
 */
const { visit } = require('unist-util-visit');

/** Recursively extract plain text from an MDAST node. */
function extractText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value || '';
  }
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

function remarkTableWideCells({ threshold = 100 } = {}) {
  return (tree) => {
    visit(tree, 'table', (table) => {
      if (!table.children || table.children.length === 0) return;

      // Determine the number of columns from the first row
      const numCols = table.children[0].children
        ? table.children[0].children.length
        : 0;
      if (numCols === 0) return;

      // Check each column: does ANY cell exceed the threshold?
      const wideColumns = new Set();
      for (const row of table.children) {
        if (!row.children) continue;
        for (let colIdx = 0; colIdx < row.children.length; colIdx++) {
          if (wideColumns.has(colIdx)) continue;
          const cell = row.children[colIdx];
          const text = extractText(cell);
          if (text.length > threshold) {
            wideColumns.add(colIdx);
          }
        }
      }

      if (wideColumns.size === 0) return;

      // Tag all cells in wide columns
      for (const row of table.children) {
        if (!row.children) continue;
        for (let colIdx = 0; colIdx < row.children.length; colIdx++) {
          if (!wideColumns.has(colIdx)) continue;
          const cell = row.children[colIdx];
          cell.data = cell.data || {};
          cell.data.hProperties = cell.data.hProperties || {};
          const existing = cell.data.hProperties.className || [];
          cell.data.hProperties.className = [...existing, 'wide-cell'];
        }
      }
    });
  };
}

module.exports = remarkTableWideCells;
