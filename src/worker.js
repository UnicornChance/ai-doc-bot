import { createSearchIndex, searchDocumentation } from './search.js';

let fuse; // Fuse.js instance

// Function to send logs from worker to main thread
function logFromWorker(message) {
  postMessage({ log: message });
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  const { docs, query } = event.data;

  if (docs) {
    // Create a new search index when docs are provided
    fuse = createSearchIndex(docs);
    logFromWorker('Search index created in worker with documents.');
  }

  if (query && fuse) {
    // Perform the search when a query is provided
    logFromWorker(`Searching for query: ${query}`);
    const results = searchDocumentation(fuse, query);
    logFromWorker(`Search results: ${JSON.stringify(results)}`);
    postMessage(results); // Send the search results back to the main thread
  }
};
