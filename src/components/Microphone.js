import React, { useState, useRef, useEffect } from "react";

export default function Microphone() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [pastTranscriptions, setPastTranscriptions] = useState([]); // State to store past transcriptions
  const [showPast, setShowPast] = useState(false); // State to toggle past transcriptions visibility
  const timerRef = useRef(null);
  const ws = useRef(null);
  const recorder = useRef(null);

  // Function to start recording and handle WebSocket connection
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create WebSocket connection
      ws.current = new WebSocket("ws://localhost:5000");

      // Set up WebSocket events
      ws.current.onopen = () => {
        console.log("WebSocket connection opened");
        document.body.classList.add("recording"); // Add 'recording' class when connected
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
        document.body.classList.remove("recording"); // Remove 'recording' class when closed
      };

      ws.current.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // Update transcription if a new transcript is available
        if (data.channel.alternatives[0].transcript !== "") {
          setTranscription((prev) => prev + " " + data.channel.alternatives[0].transcript);
        }
      };

      ws.current.onerror = () => setError("WebSocket error occurred.");

      // Create MediaRecorder instance for capturing audio
      recorder.current = new MediaRecorder(stream);
      recorder.current.ondataavailable = (event) => {
        // Send audio data to WebSocket if connection is open
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(event.data);
        }
      };

      // Start recording with 1-second intervals to capture and send audio data
      recorder.current.start(1000); 
      setIsRecording(true); // Set recording state to true
      setError(""); // Clear any previous error
      setTimer(0); // Reset the timer
      // Set a timer to track recording duration
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } catch (err) {
      setError("Microphone access denied."); // Handle error if microphone access is denied
    }
  };

  // Function to stop recording and save the transcription
  const stopRecording = () => {
    recorder.current.stop();
    setIsRecording(false); // Set recording state to false
    if (ws.current) {
      ws.current.close(); // Close the WebSocket connection
    }
    clearInterval(timerRef.current); // Clear the timer
    // Save the current transcription to past transcriptions
    setPastTranscriptions((prev) => [...prev, transcription]);
    setTranscription(""); // Clear current transcription after stopping
  };

  // Function to clear the transcription
  const clearTranscription = () => {
    setTranscription(""); // Reset transcription state
  };

  // Toggle visibility of past transcriptions
  const togglePastTranscriptions = () => {
    setShowPast(!showPast); // Toggle the visibility state of past transcriptions
  };

  useEffect(() => {
    // Cleanup function to close WebSocket and clear timer on component unmount
    return () => {
      if (ws.current) ws.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gray-800 text-white font-sf-ui">{/* Apply San Francisco font */}
      {/* Header */}
      <header className="w-full bg-blue-500 py-6 text-center text-white text-3xl font-bold">
        Real-Time Transcription App
      </header>

      {/* Main Content Container */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-6 md:px-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full">
            {error}
          </div>
        )}

        {/* Start/Stop Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-32 h-32 flex items-center justify-center rounded-full text-white text-xl font-bold ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
          } focus:outline-none shadow-lg`}
        >
          {isRecording ? "Stop" : "Start"}
        </button>

        {/* Timer */}
        <p className="text-gray-400 text-lg mt-4">
          {isRecording && `Recording Time: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}
        </p>

        {/* Transcription Area */}
        <textarea
          readOnly
          value={transcription}
          className="mt-6 w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Live transcription will appear here..."
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end w-full mt-4 space-x-4">
          <button
            onClick={clearTranscription}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
          >
            Clear
          </button>

          {/* Button to show past transcriptions */}
          <button
            onClick={togglePastTranscriptions}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            {showPast ? "Hide" : "Show"} Past Transcriptions
          </button>
        </div>

        {/* Past Transcriptions */}
        {showPast && (
          <div className="mt-6 w-full bg-gray-700 p-4 border border-gray-600 rounded-lg">
            <h3 className="text-xl font-bold text-white">Past Transcriptions:</h3>
            <pre className="text-gray-300 mt-2 whitespace-pre-wrap">{pastTranscriptions.join("\n\n-----\n\n")}</pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-blue-500 py-3 text-center text-white text-sm">
        © 2024 Real-Time Transcription App
      </footer>
    </div>
  );
}
