#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Servo.h>

// Replace with your network credentials
const char* ssid = "Wifi__00";
const char* password = "cctv4020";

// Create the web server on port 80
AsyncWebServer server(80);

// Define the servos
Servo baseServo;
Servo shoulderServo;
Servo elbowServo;
Servo wristServo;
Servo gripperServo;

// Initial servo positions
int basePosition = 90;
int shoulderPosition = 90;
int elbowPosition = 90;
int wristPosition = 90;
bool gripperOpen = false;

// Pin configuration
const int basePin = 16;
const int shoulderPin = 17;
const int elbowPin = 18;
const int wristPin = 19;
const int gripperPin = 21;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Attach servos to their respective pins
  baseServo.attach(basePin);
  shoulderServo.attach(shoulderPin);
  elbowServo.attach(elbowPin);
  wristServo.attach(wristPin);
  gripperServo.attach(gripperPin);

  // Set initial positions
  baseServo.write(basePosition);
  shoulderServo.write(shoulderPosition);
  elbowServo.write(elbowPosition);
  wristServo.write(wristPosition);
  gripperServo.write(gripperOpen ? 180 : 0);

  // Define the root URL and the command handler
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "ESP32 Robot Arm Control Panel");
  });

  server.on("/control", HTTP_GET, [](AsyncWebServerRequest *request){
    if (request->hasParam("command")) {
      String command = request->getParam("command")->value();
      Serial.println("Command received: " + command);
      handleCommand(command);
    }
    request->send(200, "text/plain", "Command received");
  });

  // Start the server
  server.begin();
}

void loop() {
  // Nothing to do here, the server handles everything asynchronously
}

void handleCommand(String command) {
  if (command == "rotate_left") {
    basePosition = max(basePosition - 10, 0);
    baseServo.write(basePosition);
  } else if (command == "rotate_right") {
    basePosition = min(basePosition + 10, 180);
    baseServo.write(basePosition);
  } else if (command == "move_up") {
    shoulderPosition = max(shoulderPosition - 10, 0);
    shoulderServo.write(shoulderPosition);
  } else if (command == "move_down") {
    shoulderPosition = min(shoulderPosition + 10, 180);
    shoulderServo.write(shoulderPosition);
  } else if (command == "bend_inward") {
    elbowPosition = max(elbowPosition - 10, 0);
    elbowServo.write(elbowPosition);
  } else if (command == "extend_outward") {
    elbowPosition = min(elbowPosition + 10, 180);
    elbowServo.write(elbowPosition);
  } else if (command == "rotate_wrist_left") {
    wristPosition = max(wristPosition - 10, 0);
    wristServo.write(wristPosition);
  } else if (command == "rotate_wrist_right") {
    wristPosition = min(wristPosition + 10, 180);
    wristServo.write(wristPosition);
  } else if (command == "close_gripper") {
    gripperOpen = false;
    gripperServo.write(0);
  } else if (command == "open_gripper") {
    gripperOpen = true;
    gripperServo.write(180);
  }

  // Output current servo positions for debugging
  Serial.print("Base: ");
  Serial.print(basePosition);
  Serial.print(" | Shoulder: ");
  Serial.print(shoulderPosition);
  Serial.print(" | Elbow: ");
  Serial.print(elbowPosition);
  Serial.print(" | Wrist: ");
  Serial.print(wristPosition);
  Serial.print(" | Gripper: ");
  Serial.println(gripperOpen ? "Open" : "Closed");
}