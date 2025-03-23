// commandSender.js

// Get the angle input element and attach event listeners only once.
const angleInput = document.getElementById('angle-input');
let rotatingAngle = parseFloat(angleInput.value);

angleInput.addEventListener('input', function() {
  rotatingAngle = parseFloat(angleInput.value);
});

angleInput.addEventListener('wheel', function(event) {
  event.preventDefault();
  let delta = event.deltaY > 0 ? -1 : 1;
  rotatingAngle = Math.max(1, Math.min(9, rotatingAngle + delta));
  angleInput.value = rotatingAngle;
});

// This function builds a command object and sends it to the ESP32.
export function sendCommand(direction, part) {
  // Build the command object using the current angle input value.
  const command = {
    part: part,
    direction: direction,
    angle: angleInput.value
  };

  // Convert the command to a JSON string.
  const commandStr = JSON.stringify(command);

  // Send the command using the WebSocket send function.
  // We assume sendCommandToESP32 is defined globally (from websocket.js) or imported.
  if (typeof sendCommandToESP32 === 'function') {
    sendCommandToESP32(commandStr);
  } else {
    console.error("sendCommandToESP32 is not defined.");
  }
}

window.sendCommand = sendCommand;
