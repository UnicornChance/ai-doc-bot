### Updated `README.md`

# AI Doc Bot

AI Doc Bot is a JavaScript-based documentation bot that provides developers with an easy-to-integrate solution for creating an intelligent assistant on their websites. The bot automatically parses documentation and source code comments from a specified GitHub repository and uses that data to answer questions.

## Features

- Automatic Repository Parsing: Fetches all relevant files (e.g., `.md`, `.js`, `.py`) from a specified GitHub repository.
- Supports Multiple Programming Languages: Extracts comments and documentation from JavaScript, TypeScript, Python, Java, C++, and more.
- Searchable Index: Utilizes Fuse.js for fast, fuzzy searching of documentation and code comments.
- Configurable and Extensible: Easily configurable to support different file types, directories, and more.
- Efficient Caching: Caches repository data for 48 hours to minimize network requests and improve performance.
- Manual Refresh Option: Users can refresh data manually to update the cached information.

## Table of Contents

- Installation
- Usage
- Customizing the Bot
- Development
- Project Structure
- Available Scripts
- Contributing
- License

## Installation

To get started, clone the repository and install the dependencies:

1. Clone the repository: `git clone https://github.com/yourusername/ai-doc-bot.git`
2. Navigate to the project directory: `cd ai-doc-bot`
3. Install the dependencies: `npm install`
4. Build the application: `npm run build`
5. Start the application: `npm run start`

## Usage

To use the AI Doc Bot:

1. Build the Project: This will compile the JavaScript files and copy static assets to the `dist` folder.

   Run `npm run build` in the terminal.

2. Start the Development Server: Serve the files from the `dist` directory using `lite-server`.

   Run `npm start` in the terminal.

3. Open Your Browser: Visit `http://localhost:3000` to see the documentation bot in action. You can type questions in the bot window, and it will provide answers based on the documentation and code comments parsed from the specified GitHub repository.

4. Refresh Data Manually: Click the "Refresh Data" button in the bot UI to clear the cache and fetch the latest data from the repository.

### Customizing the Bot

To customize which repository the bot fetches data from or to adjust other parsing logic, modify the source code in the following files:

- `src/fetchDocs.js`: Contains logic for fetching files from a GitHub repository. Update the `repoUrl` variable in `fetchDocs.js` to change the repository that the bot will use. The cache duration is set to 48 hours by default but can be adjusted in the same file.
- `src/search.js`: Contains logic for indexing and searching through the documentation and comments.
- `src/utils.js`: Utility functions for extracting comments from various types of code files. You can add support for more programming languages here.

## Development

If you'd like to contribute or modify the project, follow these instructions:

### Project Structure

ai-doc-bot/

- public/ : Static assets
  - index.html : Main HTML file
  - favicon.ico : Favicon for the website
  - style.css : Styles for the bot UI
- src/ : Source code
  - bot.js : Main bot logic and UI handling
  - fetchDocs.js : Logic for fetching files from GitHub and caching data
  - search.js : Logic for indexing and searching documents
  - utils.js : Utility functions for parsing and extracting comments
- dist/ : Distribution folder for built files
  - (generated files like bot.bundle.js)
- webpack.config.js : Webpack configuration for building the project
- bs-config.json : Configuration for lite-server
- package.json : Project metadata and scripts
- README.md : Project documentation

### Available Scripts

- `npm run build`: Builds the project, compiles JavaScript files using Webpack, and copies static assets to the `dist` directory.
- `npm start`: Runs the development server (`lite-server`) to serve files from the `dist` directory.
- `npm run clean`: Cleans the `dist` directory by removing generated files.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

Please ensure your code follows the existing code style and includes relevant tests where applicable.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

### End of README

This updated README reflects the recent changes, including caching optimizations, error handling improvements, and better structure for code readability. If there are any other adjustments or enhancements you'd like to include, let me know!