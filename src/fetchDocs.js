// src/fetchDocs.js

import axios from 'axios';
import { GITHUB_TOKEN, REPO_URL } from './config.js'; // Import from config.js

const CACHE_KEY = 'repoDataCache'; // Key to store data in localStorage
const CACHE_TIME_KEY = 'repoDataCacheTime'; // Key to store cache timestamp
const LAST_COMMIT_KEY = 'lastCommitSha'; // Key to store the last commit SHA
const CACHE_DURATION = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

export async function fetchAllFilesFromRepo() {
  // Check cache first
  const lastCommitSha = localStorage.getItem(LAST_COMMIT_KEY);
  const latestCommitSha = await fetchLatestCommitSha(REPO_URL);

  if (lastCommitSha === latestCommitSha) {
    const cachedData = getCachedRepoData();
    if (cachedData) {
      console.log('Using cached repository data');
      return cachedData;
    }
  }

  // If no cache or new commit, fetch the content
  const filesToFetch = await fetchListOfFiles(REPO_URL); // Fetch the list of files to fetch content for

  const docs = [];
  for (const file of filesToFetch) {
    const content = await fetchFileContent(file.path);
    if (content) {
      docs.push({ path: file.path, content });
    } else {
      console.warn(`Content for ${file.path} is empty or failed to fetch.`);
    }
  }

  cacheRepoData(docs, latestCommitSha); // Cache the data and commit SHA
  return docs;
}

/**
 * Fetches the latest commit SHA of the repository.
 */
async function fetchLatestCommitSha(repoUrl) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoUrl}/commits`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    });
    return response.data[0].sha; // Get the latest commit SHA
  } catch (error) {
    console.error('Error fetching the latest commit SHA:', error);
    return null;
  }
}

/**
 * Fetches a list of relevant files to fetch content from the repository.
 */
async function fetchListOfFiles(repoUrl) {
  const apiUrl = `https://api.github.com/repos/${repoUrl}/contents`;
  const files = [];
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    });

    for (const file of response.data) {
      if (file.type === 'file' && isRelevantFile(file.name)) {
        files.push({ path: file.path });
      } else if (file.type === 'dir' && !isExcludedDir(file.name)) {
        // Optionally handle subdirectories here if needed
        console.log(`Skipping directory: ${file.path}`);
      }
    }
  } catch (error) {
    console.error('Error fetching list of files:', error);
  }

  return files;
}

/**
 * Fetches content of a file using the GitHub API.
 */
async function fetchFileContent(filePath) {
  const apiUrl = `https://api.github.com/repos/${REPO_URL}/contents/${encodeURIComponent(filePath)}`;

  try {
    console.log(`Fetching content for file: ${filePath} using URL: ${apiUrl}`);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    });

    if (response.data && response.data.content) {
      const decodedContent = atob(response.data.content); // Decode Base64 to plain text
      console.log(`Decoded content for ${filePath}:`, decodedContent); // Log decoded content for debugging
      return decodedContent;
    } else {
      console.error(`No content found for ${filePath}. Response data:`, response.data);
      return '';
    }
  } catch (error) {
    console.error(`Error fetching file content from ${apiUrl}:`, error);
    return '';
  }
}

/**
 * Determines if a file is relevant to fetch based on its extension.
 */
function isRelevantFile(fileName) {
  const relevantExtensions = ['.md', '.js', '.ts', '.py', '.java', '.cpp', '.c'];
  const excludeExtensions = ['.png', '.jpg', '.gif', '.svg', '.zip', '.pdf'];
  return (
    relevantExtensions.some(ext => fileName.endsWith(ext)) &&
    !excludeExtensions.some(ext => fileName.endsWith(ext))
  );
}

function isExcludedDir(dirName) {
  const excludeDirs = ['node_modules', 'dist', 'build'];
  return excludeDirs.includes(dirName);
}

function cacheRepoData(data, commitSha) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString()); // Store current timestamp
  localStorage.setItem(LAST_COMMIT_KEY, commitSha); // Cache the commit SHA
}

function getCachedRepoData() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

  if (cachedData && cacheTime) {
    const age = Date.now() - parseInt(cacheTime, 10); // Calculate age of cache
    if (age < CACHE_DURATION) {
      return JSON.parse(cachedData); // Return cached data if not expired
    } else {
      clearRepoCache(); // Clear expired cache
    }
  }
  return null;
}

export function clearRepoCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIME_KEY);
  localStorage.removeItem(LAST_COMMIT_KEY);
}
