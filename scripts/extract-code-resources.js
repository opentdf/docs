#!/usr/bin/env node

/**
 * Extract code resources from MDX files
 * Extracts code blocks marked with <!-- Code Resource XXX Start/End --> comments
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MDX_FILE = path.join(__dirname, '../docs/getting-started/index.mdx');
const OUTPUT_DIR = path.join(__dirname, '../extracted-code');

// Resources to extract (001-006)
const RESOURCES_TO_EXTRACT = ['001', '002', '003', '004', '005', '006'];

/**
 * Parse MDX file and extract code resources
 */
function extractCodeResources() {
  console.log('Reading MDX file:', MDX_FILE);
  
  if (!fs.existsSync(MDX_FILE)) {
    console.error('Error: MDX file not found:', MDX_FILE);
    process.exit(1);
  }

  const content = fs.readFileSync(MDX_FILE, 'utf-8');
  const lines = content.split('\n');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory:', OUTPUT_DIR);
  }

  let extractedCount = 0;
  
  // Process each resource
  RESOURCES_TO_EXTRACT.forEach(resourceNum => {
    const startMarker = `<!-- Code Resource ${resourceNum} Start -->`;
    const endMarker = `<!-- Code Resource ${resourceNum} End -->`;
    
    let extracting = false;
    let codeLines = [];
    let language = '';
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      // Remove blockquote markers for comparison
      const cleanLine = line.replace(/^>\s*/, '');
      
      // Start extraction
      if (cleanLine.includes(startMarker)) {
        extracting = true;
        continue;
      }
      
      // End extraction
      if (cleanLine.includes(endMarker)) {
        if (extracting && codeLines.length > 0) {
          // Determine filename based on language
          const ext = getFileExtension(language, resourceNum);
          const filename = `code-resource-${resourceNum}${ext}`;
          const filepath = path.join(OUTPUT_DIR, filename);
          
          // Write the code to file
          const code = codeLines.join('\n');
          fs.writeFileSync(filepath, code);
          console.log(`✓ Extracted Resource ${resourceNum} -> ${filename} (${codeLines.length} lines)`);
          extractedCount++;
        }
        extracting = false;
        codeLines = [];
        language = '';
        inCodeBlock = false;
        break;
      }
      
      // Extract code content
      if (extracting) {
        // Detect start of code fence (handle blockquote markers)
        const codeBlockMatch = cleanLine.trim().match(/^```(\w*)/);
        if (codeBlockMatch) {
          if (!inCodeBlock) {
            // Starting code block
            language = codeBlockMatch[1] || '';
            inCodeBlock = true;
          } else {
            // Ending code block
            inCodeBlock = false;
          }
          continue;
        }
        
        // Add line if we're inside a code block (remove blockquote marker if present)
        if (inCodeBlock) {
          codeLines.push(cleanLine);
        }
      }
    }
  });

  console.log(`\n✓ Successfully extracted ${extractedCount} code resources to ${OUTPUT_DIR}`);
  return extractedCount;
}

/**
 * Determine file extension based on language
 */
function getFileExtension(language, resourceNum) {
  // Map resource numbers to known types
  const resourceTypes = {
    '001': '.sh',      // M4 chip export command
    '002': '.yaml',    // Docker Compose
    '003': '.sh',      // /etc/hosts update
    '004': '.sh',      // mkdir command
    '005': '.sh',      // keycloak cert extraction
    '006': '.sh',      // platform cert extraction
  };
  
  // Use resource-specific extension if available
  if (resourceTypes[resourceNum]) {
    return resourceTypes[resourceNum];
  }
  
  // Otherwise, determine from language tag
  const langMap = {
    'sh': '.sh',
    'shell': '.sh',
    'bash': '.sh',
    'yaml': '.yaml',
    'yml': '.yaml',
    'json': '.json',
    'javascript': '.js',
    'js': '.js',
    'typescript': '.ts',
    'ts': '.ts',
    'python': '.py',
    'py': '.py',
    'powershell': '.ps1',
  };
  
  return langMap[language.toLowerCase()] || '.txt';
}

// Run extraction
try {
  extractCodeResources();
} catch (error) {
  console.error('Error during extraction:', error.message);
  process.exit(1);
}
