`# Deepgram Transcriber

## Overview

This is a real-time transcription application built using React. The app listens to microphone input, transcribes speech to text in real-time, and displays the transcription live. It also supports storing and displaying past transcriptions. The user can clear the current transcription and toggle the visibility of past transcriptions.

### Features:
- **Live Transcription**: Transcribes spoken words in real-time and displays them.
- **Past Transcriptions**: Allows users to see previously transcribed text.
- **Reset Transcriptions**: Clears the current transcription and resets the app.

## Requirements

- **Node.js**: You must have Node.js installed to run this React app. Download it from [nodejs.org](https://nodejs.org/).
- **WebSocket Server**: The app connects to a WebSocket server to handle transcription data. A WebSocket server must be set up locally (or you can use an existing one).

## Prerequisites

1. **Node.js** (for front-end development):
 - You can verify if you have Node.js installed by running `node -v` in your terminal. If not, download it from [nodejs.org](https://nodejs.org/).

2. **Deepgram API**:
 - **Warning**: To use this app for live transcription, you will need to create an API token from the [Deepgram website](https://www.deepgram.com/).
 - The app uses Deepgram's AI model and SDK to perform live transcription. This integration relies on their API for real-time transcription.
 - **Free Tier Limitation**: The free tier of Deepgram has limited usage. If you exceed the limits of the free tier, you will need to upgrade to a paid plan. Please check Deepgram's pricing for more details.

3. **WebSocket Server**:
 - You need a WebSocket server to handle the transcription processing.
 - This app is designed to connect to a WebSocket server running locally at `ws://localhost:5000`. You can set up a server with speech-to-text capabilities or use services like Google Speech-to-Text or WebSocket servers configured for transcription.

## Features Overview

### 1. **Start/Stop Recording**
 - **Function**: When the user clicks the button labeled "Start", it starts recording from the microphone and transcribing the speech to text in real-time. When the user clicks "Stop", it stops recording and stores the transcription.

### 2. **Live Transcription**
 - **Function**: As the user speaks, the app transcribes the speech in real-time and displays it in a text box.

### 3. **Past Transcriptions**
 - **Function**: Once the recording stops, the transcription is stored in a list of past transcriptions. The user can view past transcriptions by clicking the "Show Past Transcriptions" button.

### 4. **Clear Transcriptions**
 - **Function**: The user can reset the current transcription to start fresh by clicking the "Clear" button.

## Steps to Clone, Set Up, and Run the App

### 1. Clone the repository
First, clone the repository to your local machine. Use the following command in your terminal:
`git clone https://github.com/your-username/deepgram-transcriber.git `

### 2\. Install dependencies

Navigate into the project directory and install the necessary dependencies using npm (Node Package Manager):

`cd deepgram-transcriber
npm install`

This will install all the required packages listed in `package.json`.

### 3\. Set Up the Deepgram API Token

1.  Create an account on [Deepgram](https://www.deepgram.com/).
2.  Generate an API key from the Deepgram dashboard.
3.  Store the Deepgram API key in a `.env` file as shown below:

env
`DEEPGRAM_API_KEY=your-deepgram-api-key-here`

Make sure the `.env` file is placed in the root directory of the project.

### 4\. Run the React App

Once you have the dependencies installed and the Deepgram API token set up, you can start the React app.
`npm start`

This will run the app in development mode. Open your browser and navigate to `http://localhost:3000` to view the app.

Usage
-----

1.  **Start Recording**: Click the **Start** button to begin recording. The app will transcribe speech to text in real-time.
2.  **Stop Recording**: When you're finished, click the **Stop** button to stop the recording. The transcription will be saved and displayed.
3.  **Show Past Transcriptions**: Click the **Show Past Transcriptions** button to display past transcriptions below the text area.
4.  **Clear Transcriptions**: Click the **Clear** button to reset the current transcription.

Technologies Used
-----------------

-   **React**: For building the front-end user interface.
-   **WebSockets**: For real-time communication between the client and the server.
-   **MediaRecorder API**: For recording audio from the user's microphone.
-   **Tailwind CSS**: For styling the app (simple, utility-first CSS framework).
-   **Deepgram API**: For live transcription using Deepgram's AI models.

Troubleshooting
---------------

### 1\. **WebSocket Connection Errors**:

-   Ensure that your WebSocket server is running and accessible at `ws://localhost:5000`.
-   Check the browser console for any WebSocket connection errors and verify that the server is set up correctly.

### 2\. **Microphone Access Denied**:

-   If the app cannot access the microphone, make sure that the browser has permission to use the microphone. You may need to adjust your browser settings.

### 3\. **App Not Responding to Speech**:

-   Check the WebSocket server for issues, as the transcription depends on the server sending back speech-to-text data.
-   Make sure that the server is properly handling and sending transcription data back to the client.

### 4\. **Deepgram API Limitations**:

-   **Free Tier**: The free tier of Deepgram has limited usage. Be aware of the limits on transcription time and usage, and consider upgrading to a paid plan if necessary.
-   If the transcription service stops working, check your usage limits on the Deepgram dashboard.

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.
