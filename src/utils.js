// src/utils.js

/**
 * Extract comments from a given code file content
 * @param {string} content - Code content to extract comments from
 * @param {string} fileType - Type of the code file (e.g., 'js', 'ts', 'py')
 * @returns {string} - Extracted comments as a string
 */
export function extractComments(content, fileType) {
  const regex = getCommentRegex(fileType);
  if (!regex) return '';

  const matches = content.match(regex);
  return matches ? matches.join('\n') : '';
}

/**
 * Get the appropriate regex for extracting comments based on file type
 * @param {string} fileType - Type of the code file (e.g., 'js', 'ts', 'py')
 * @returns {RegExp|null} - Regular expression for extracting comments or null if unsupported
 */
function getCommentRegex(fileType) {
  switch (fileType) {
    case 'js':
    case 'ts':
    case 'java':
    case 'cpp':
    case 'c':
      return /\/\/.*|\/\*[\s\S]*?\*\//g;
    case 'py':
      return /#.*|('''[\s\S]*?'''|"""[\s\S]*?""")/g;
    case 'rb': // Ruby
      return /#.*|=begin[\s\S]*?=end/g;
    case 'go': // Go
      return /\/\/.*|\/\*[\s\S]*?\*\//g;
    case 'rs': // Rust
      return /\/\/.*|\/\*[\s\S]*?\*\//g;
    // Add more cases as needed
    default:
      return null;
  }
}
