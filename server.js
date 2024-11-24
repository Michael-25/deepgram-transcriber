const express = require("express"); // Import Express for handling HTTP server and routing
const http = require("http"); // Core Node.js module for creating HTTP servers
const WebSocket = require("ws"); // WebSocket library for real-time communication
const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk"); // Deepgram SDK for speech-to-text
const dotenv = require("dotenv"); // dotenv for managing environment variables
dotenv.config(); // Load environment variables from a .env file

const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server using the Express app
const wss = new WebSocket.Server({ server }); // Create a WebSocket server that works with the HTTP server

// Create a Deepgram client using the API key from environment variables
const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

let keepAlive; // Variable to store the keep-alive interval for Deepgram connection

// Function to set up a live Deepgram connection and listeners for events
const setupDeepgram = (ws) => {
  const deepgram = deepgramClient.listen.live({
    language: "en", // Language for transcription
    punctuate: true, // Add punctuation to transcriptions
    smart_format: true, // Enable smart formatting (e.g., dates, numbers)
    model: "nova", // Use the "nova" transcription model
  });

  // Ensure previous keep-alive intervals are cleared
  if (keepAlive) clearInterval(keepAlive);
  
  // Send periodic keep-alive signals to maintain the connection with Deepgram
  keepAlive = setInterval(() => {
    console.log("deepgram: keepalive");
    deepgram.keepAlive();
  }, 10 * 1000); // Every 10 seconds

  // Event listeners for Deepgram
  deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
    console.log("deepgram: connected");

    // Listener for transcription data packets
    deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
      console.log("deepgram: packet received");
      console.log("deepgram: transcript received");
      console.log("socket: transcript sent to client");
      ws.send(JSON.stringify(data)); // Send the transcript data to the client via WebSocket
    });

    // Listener for connection close
    deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
      console.log("deepgram: disconnected");
      clearInterval(keepAlive); // Clear the keep-alive interval
      deepgram.finish(); // End the Deepgram session
    });

    // Listener for errors
    deepgram.addListener(LiveTranscriptionEvents.Error, async (error) => {
      console.log("deepgram: error received");
      console.error(error);
    });

    // Listener for warnings
    deepgram.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
      console.log("deepgram: warning received");
      console.warn(warning);
    });

    // Listener for metadata packets
    deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
      console.log("deepgram: packet received");
      console.log("deepgram: metadata received");
      console.log("ws: metadata sent to client");
      ws.send(JSON.stringify({ metadata: data })); // Send metadata to the client
    });
  });

  return deepgram; // Return the Deepgram instance
};

// Handle new WebSocket connections
wss.on("connection", (ws) => {
  console.log("socket: client connected");
  let deepgram = setupDeepgram(ws); // Set up Deepgram for this connection

  // Handle messages from the client
  ws.on("message", (message) => {
    console.log("socket: client data received");

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      console.log("socket: data sent to deepgram");
      deepgram.send(message); // Send audio data to Deepgram for transcription
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      console.log("socket: data couldn't be sent to deepgram");
      console.log("socket: retrying connection to deepgram");

      // Attempt to reopen the Deepgram connection
      deepgram.finish();
      deepgram.removeAllListeners();
      deepgram = setupDeepgram(ws); // Reinitialize Deepgram
    } else {
      console.log("socket: data couldn't be sent to deepgram");
    }
  });

  // Handle client disconnections
  ws.on("close", () => {
    console.log("socket: client disconnected");
    deepgram.finish(); // End the Deepgram session
    deepgram.removeAllListeners(); // Remove event listeners
    deepgram = null; // Clean up the Deepgram instance
  });
});

// Serve static files from the "public" directory
app.use(express.static("public/"));

// Route for the root URL, serving the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
