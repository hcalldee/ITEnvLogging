#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

// Replace these with your network credentials
const char* ssid = "rspi.ranap";
const char* password = "rspi2023";

// Initialize DHT sensor
DHT dht(26, DHT11); // DHT11 on GPIO 26

// Create a web server on port 80
WebServer server(80);

// API endpoint
const char* apiEndpoint = "http://192.168.1.108:8028/submit";
const char* itemEndpoint = "http://192.168.1.108:8028/getRuanganSpec";

// Global ID
const int id = 1; // Replace with your actual ID_item, kode mesin

// Function to handle POST request to /submit

struct SensorData {
  float temperature;
  float humidity;
};

// Function to post the adjusted temperature and humidity data
void submitData(float temperature, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiEndpoint);  // Specify the URL for data submission
    http.addHeader("Content-Type", "application/json");  // Content type as JSON
    http.setTimeout(15000); 
    // Create the JSON payload
    StaticJsonDocument<200> jsonPayload;
    jsonPayload["id"] = id;
    jsonPayload["temperature"] = temperature;
    jsonPayload["humidity"] = humidity;
    String jsonString;
    serializeJson(jsonPayload, jsonString);

    // Send the POST request with the JSON payload
    int httpResponseCode = http.POST(jsonString);
    
    // Check the response from the server
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Submission Response code: " + String(httpResponseCode));
      Serial.println("Response from server waktu post: " + response);
    } else {
      Serial.println("Error on data submission");
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      String errorMessage = http.errorToString(httpResponseCode);
      Serial.println("Error message: " + errorMessage);
    }

    http.end();  // Free the resources
  } else {
    Serial.println("WiFi not connected");
  }
}

// Function to make an HTTP POST request, get `wt` and `wh`, and submit adjusted data
SensorData postData() {
  SensorData data = {0.0, 0.0};  // Initialize with default values

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(itemEndpoint);  // Specify the URL for the POST request
    http.addHeader("Content-Type", "application/json");  // Specify content type as JSON
    String postData = "{\"type\": \"id\", \"data\": \"1\"}";  // JSON payload for the first request
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();  // Get the response payload
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response from server waktu get: " + response);

      // Parse JSON response and extract `wt` and `wh`
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, response);

      if (!error) {
        float wt = doc["wt"];  // Extract `wt`
        float wh = doc["wh"];  // Extract `wh`

        // Read temperature and humidity from DHT sensor
        data.temperature = dht.readTemperature() + wt;  // Add `wt` to temperature
        data.humidity = dht.readHumidity() + wh;        // Add `wh` to humidity
        
      } else {
        Serial.println("Failed to parse JSON");
      }
    } else {
      Serial.println("Error on HTTP request");
    }

    http.end();  // Free the resources
  } else {
    Serial.println("WiFi not connected");
  }

  return data;
}
void handleSubmit() {
  SensorData data = postData();  // Get the data from postData
  submitData(data.temperature, data.humidity); 
}


// Function to handle GET request to /sensor
void handleSensor() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    server.send(500, "application/json", "{\"error\":\"Failed to read from sensor\"}");
    return;
  }

   // Create JSON response
  String jsonResponse = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
  
  // Send the JSON response
  Serial.println("\nIncomming Request");
  server.send(200, "application/json", jsonResponse);
}

// Function to handle POST request to API endpoint
bool postDataToApi(const String& jsonData) {
  HTTPClient http;
  http.begin(apiEndpoint);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonData);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
    http.end();
    return true;
  } else {
    Serial.println("Error code: " + String(httpResponseCode));
    http.end();
    return false;
  }
}

// Function to handle GET request to /reset
void handleReset() {
  String response = "{\"status\":\"resetting\"}";
  server.send(200, "application/json", response);
  delay(500); // Wait a moment before restarting
  ESP.restart(); // Restart ESP32
}

// Function to handle root request
void handleRoot() {
  server.send(200, "text/plain", "Welcome to ESP32 Web Service");
}

void setup() {
  // Start serial communication
  Serial.begin(115200);

  // Initialize DHT sensor
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnected to Wi-Fi");

  // Print the IP address
  Serial.println(WiFi.localIP());

  // Define routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/submit", HTTP_POST, handleSubmit);
  server.on("/readTemp", HTTP_GET, handleSensor);
  server.on("/reset", HTTP_GET, handleReset); // New endpoint for reset

  // Start the server
  server.begin();
}

void loop() {
  // Handle client requests
  server.handleClient();
}
