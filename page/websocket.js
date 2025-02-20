document.addEventListener("DOMContentLoaded", () => {
    // Set the ESP32 IP address (adjust as needed)
    const esp32IP = "192.168.27.130";
    const wsUrl = `ws://${esp32IP}/ws`;
    let socket = new WebSocket(wsUrl);
  
    // DOM elements for UI updates
    const connectionElem = document.getElementById("connection"); // Connection status display
    const deviceElem = document.getElementById("device");         // Available devices display
    const messageUpdateElem = document.querySelector(".message-update"); // Container for messages
    const messageMarker = document.getElementById("message-marker"); // Marker for new messages (dot)
    const socketMarker = document.getElementById("socket-marker");   // Marker for socket connection status
  
    // Initially, indicate trying to connect and show the socket marker
    deviceElem.textContent = `Trying to connect to ${wsUrl}...`;
    if (socketMarker) {
      socketMarker.style.visibility = "visible";
    }
  
    // Append a new message to the message overlay and ensure message marker is visible.
    // Note: This function no longer changes socket-marker visibility.
    function appendMessage(text) {
      if (messageUpdateElem) {
        const newMsg = document.createElement("div");
        newMsg.textContent = text;
        messageUpdateElem.appendChild(newMsg);
      }
      if (messageMarker) {
        messageMarker.style.visibility = "visible";
      }
    }
  
    socket.onopen = () => {
      console.log("Connected to Robotic Arm WebSocket");
      connectionElem.textContent = "Connected to Robotic Arm";
      appendMessage("Connected successfully.");
      deviceElem.textContent = `Connected to ${wsUrl} (Robotic Arm)`;
      if (socketMarker) {
        socketMarker.style.visibility = "visible";
      }
    };
  
    socket.onmessage = (event) => {
      console.log("Message from ESP32:", event.data);
      appendMessage(event.data);
    };
  
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      connectionElem.textContent = "Connection Error";
      appendMessage("Error connecting to ESP32.");
      deviceElem.textContent = `Failed to connect to ${wsUrl}`;
      // Hide the socket-marker on error (if desired)
      if (socketMarker) {
        socketMarker.style.visibility = "hidden";
      }
    };
  
    socket.onclose = () => {
      console.log("WebSocket closed");
      connectionElem.textContent = "Not Connected";
      appendMessage("WebSocket closed. Not Connected.");
      deviceElem.textContent = `Failed to connect to ${wsUrl}`;
      if (socketMarker) {
        socketMarker.style.visibility = "hidden";
      }
    };
  
    // Expose a function to send commands to the ESP32
    window.sendCommandToESP32 = (command) => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("Sending command:", command);
        socket.send(command);
      } else {
        console.log("WebSocket is not connected");
        appendMessage("Cannot send command. Not connected.");
      }
    };
  
    // Example: Hook up a UI control (e.g., a button with ID "baseClock") to send a command.
    const baseClockBtn = document.getElementById("baseClock");
    if (baseClockBtn) {
      baseClockBtn.addEventListener("click", () => {
        sendCommandToESP32("base_clock");
      });
    }
  });  
