// src/bot.js
import { fetchAllFilesFromRepo, clearRepoCache } from './fetchDocs.js';

import { GITHUB_TOKEN, REPO_URL } from './config.js'; // Import from config.js

import axios from 'axios';

const worker = new Worker('worker.js');

worker.onmessage = function (event) {
  if (event.data.log) {
    console.log('Worker Log:', event.data.log); // Display worker logs in the main console
    return;
  }
  const results = event.data;
  const botResponse = results.length ? results[0].item.text : "I couldn't find relevant information.";
  addMessageToChat(botResponse, true, botBody);
};

function handleUserQuery(botInput, botBody) {
  const userQuery = botInput.value.trim();
  if (userQuery) {
    addMessageToChat(userQuery, false, botBody);
    worker.postMessage({ query: userQuery }); // Send query to worker
    botInput.value = '';
  }
}

async function initBot() {
  try {
    const docs = await fetchAllFilesFromRepo(); // Fetch or use cached data
    console.log('Fetched Documents:', docs); // Log fetched documents to verify data

    // Display the content of README.md if available
    const readmeDoc = docs.find(doc => doc.path === 'README.md');
    if (readmeDoc) {
      console.log('README.md Content:', readmeDoc.content); // Log README.md content
    }

    worker.postMessage({ docs }); // Initialize worker with documents
    initializeBotUI(docs);
  } catch (error) {
    console.error('Failed to initialize bot:', error);
    alert('Failed to load the documentation. Please try again later.');
  }
}


function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initializeBotUI(docs) {
  const botToggle = document.getElementById('bot-toggle');
  const botWindow = document.getElementById('bot-window');
  const botBody = document.getElementById('bot-body');
  const botInput = document.getElementById('bot-input');
  const botSend = document.getElementById('bot-send');

  // Create Refresh Button
  const botRefresh = document.createElement('button');
  botRefresh.innerText = '🔄 Refresh Data';
  botWindow.insertBefore(botRefresh, botWindow.firstChild);

  // Toggle chatbot visibility
  botToggle.addEventListener('click', () => {
    botWindow.style.display = botWindow.style.display === 'none' ? 'block' : 'none';
  });

  // Send message handler
  botSend.addEventListener('click', debounce(() => handleUserQuery(botInput, botBody), 300));

  // Refresh data button handler
  botRefresh.addEventListener('click', async () => {
    try {
      await refreshData(botBody);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      addMessageToChat('Failed to refresh data. Please try again later.', true, botBody);
    }
  });
}

async function refreshData(botBody) {
  clearRepoCache(); // Clear the existing cache
  const newDocs = await fetchAllFilesFromRepo(); // Fetch fresh data
  console.log('Data refreshed. New documents fetched:', newDocs); // Log new docs to verify
  worker.postMessage({ docs: newDocs }); // Update worker with new docs
  addMessageToChat('Data has been refreshed.', true, botBody);
}


function addMessageToChat(message, fromBot, botBody) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.classList.add(fromBot ? 'bot-message' : 'user-message'); // Optional: Add classes for styling

  if (fromBot) {
    messageDiv.style.fontWeight = 'bold';
  }
  botBody.appendChild(messageDiv);
  botBody.scrollTop = botBody.scrollHeight; // Scroll to the bottom to show the latest message
}


initBot();


async function testFetchFileContent() {
  const filePath = 'README.md'; // Example file path to test
  const apiUrl = `https://api.github.com/repos/${REPO_URL}/contents/${filePath}`;
 
  try {
    console.log(`Testing fetch content for file: ${filePath} using URL: ${apiUrl}`);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    });

    console.log(`Full API response for ${filePath}:`, response.data);

    if (response.data && response.data.content) {
      const decodedContent = atob(response.data.content);
      console.log(`Decoded content for ${filePath}:`, decodedContent);
    } else {
      console.error(`No content found for ${filePath}. Response data:`, response.data);
    }
  } catch (error) {
    console.error(`Error fetching file content from ${apiUrl}:`, error);
  }
}

testFetchFileContent(); 