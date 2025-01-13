# Grammar Checker Chrome Extension

This Chrome extension allows users to check and correct grammar in selected text on any webpage. It integrates with a backend API to verify and suggest grammar corrections.

## Features
- Right-click on selected text to check grammar.
- Sends the selected text to a backend API.
- Displays the corrected text in the same place on the page.

## Installation

1. Download or clone this repository to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click on **Load unpacked**.
5. Select the folder where the extension files are located.
6. The extension will now be installed and ready to use.

## Usage

1. Select some text on any webpage.
2. Right-click the selected text and choose **Check Grammar** from the context menu.
3. The extension will send the text to the backend and replace the selected text with the corrected version.

## Backend API

This extension communicates with a backend server to check grammar. Ensure that the backend server is running on `http://localhost:3000/` (or replace this with your own server URL).

### Backend Requirements
- Node.js (for backend server)
- API endpoint: `POST /submit` that accepts a `prompt` in the request body and returns the corrected grammar text.

## Manifest Configuration

The extension uses the following manifest file configuration:

```json
{
  "manifest_version": 3,
  "name": "Grammar Checker",
  "version": "1.0",
  "permissions": [
    "contextMenus",
    "activeTab",
    "scripting",
    "http://*/",
    "https://*/"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": [
    "http://localhost:3000/",
    "https://your-backend-url.com/"
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
