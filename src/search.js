// src/search.js
import Fuse from 'fuse.js';
import { extractComments } from './utils.js';  // Ensure the path is correct

/**
 * Create a search index using Fuse.js on documentation and code comments
 * @param {Array<{ path: string, content: string }>} docs - List of files with their paths and content
 * @returns {Fuse} - Fuse.js instance with the indexed content
 */
export function createSearchIndex(docs) {
  const indexedData = [];

  docs.forEach(({ path, content }) => {
    if (path.endsWith('.md')) {
      indexedData.push({ path, text: content });
    } else {
      const fileType = path.split('.').pop();
      const comments = extractComments(content, fileType);
      if (comments) {
        indexedData.push({ path, text: comments });
      }
    }
  });

  return new Fuse(indexedData, {
    keys: ['text'],
    includeScore: true,
    threshold: 0.3,
  });
}

/**
 * Search the documentation and code comments for a given query
 * @param {Fuse} fuse - Fuse.js instance
 * @param {string} query - User query
 * @returns {Array} - Search results
 */
export function searchDocumentation(fuse, query) {
  return fuse.search(query);
}
