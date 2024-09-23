#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Include the ArduinoJson library

#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

const int inside_tri = 12;
const int inside_echo = 14;
const int outside_tri = 27;
const int outside_echo = 26;

int visitor = 0;

int inside = 0;
int inside_lastedUpdate = 0;
int outside = 0;
int outside_lastedUpdate = 0;

int inside_prev = 0;
int outside_prev = 0;

long microsecondsToCentimeters(long);

long getDistanceUltrasonic(int triPin, int echoPin)
{
  long duration = 0;

  // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  digitalWrite(triPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triPin, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH pulse
  // whose duration is the time (in microseconds) from the sending of the ping
  // to the reception of its echo off of an object.
  duration = pulseIn(echoPin, HIGH);

  return microsecondsToCentimeters(duration);
}

long microsecondsToCentimeters(long microseconds)
{
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the object we
  // take half of the distance travelled.
  return microseconds / 29 / 2;
}

int getVisitor(int distance1, int distance2)
{
  // in CM units
  int doorWidth = 75;
  int peopleWidth = 55;
  // long visitorWidth = (distance1 + distance2) - doorWidth;

  // visitorswidth / people
  int visitorCount = (doorWidth - (distance1 + distance2)) >= peopleWidth ? (doorWidth - (distance1 + distance2)) / peopleWidth : 0;

  return visitorCount;
}

void setup()
{
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // disable detector

  // initialize serial communication:
  Serial.begin(9600);

  WiFi.mode(WIFI_STA); // Optional
  WiFi.begin("Wongkum", "0841733113");
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  pinMode(inside_tri, OUTPUT);
  pinMode(inside_echo, INPUT);
  pinMode(outside_tri, OUTPUT);
  pinMode(outside_echo, INPUT);
}

void loop()
{
  // int inside_visitor = getVisitor(getDistanceUltrasonic(inside_tri, inside_echo), 0);
  // delay(100);
  // int outside_visitor = getVisitor(getDistanceUltrasonic(outside_tri, outside_echo), 0);

  int inside_visitor = getDistanceUltrasonic(inside_tri, inside_echo) <= 10 ? 1 : 0;
  delay(100);
  int outside_visitor = getDistanceUltrasonic(outside_tri, outside_echo) <= 10 ? 1 : 0;

  if (inside > 0 && millis() - inside_lastedUpdate >= 2500)
  {
    inside = 0;
    Serial.println("Reset Inside");
  }

  if (outside > 0 && millis() - outside_lastedUpdate >= 2500)
  {
    outside = 0;
    Serial.println("Reset Outside");
  }

  if (inside_prev != inside_visitor)
  {
    int inside_coming = inside_visitor - inside_prev;

    if (inside_coming > 0)
    {
      // coming
      inside += 1;
      inside_lastedUpdate = millis();
    }
    else if (inside_coming < 0)
    {
      // exit
      if (outside > 0)
      {
        visitor += 1;

        inside -= 1;
        outside -= 1;

        Serial.println(visitor);

        if (WiFi.status() == WL_CONNECTED)
        {
          WiFiClient client;
          HTTPClient http;

          // Your Domain name with URL path or IP address with path
          http.begin(client, "http://192.168.0.104:3000/api/v1/visitor/visitor-update/");

          // Specify content-type header
          http.addHeader("Content-Type", "application/json");
          // Data to send with HTTP POST

          // Create a JSON object using ArduinoJson
          StaticJsonDocument<200> doc;
          doc["roomID"] = 1;
          doc["userCurrent"] = visitor;
          doc["userDiff"] = 1;

          // Convert JSON object to string
          String requestBody;
          serializeJson(doc, requestBody);

          // Send HTTP POST request
          int httpResponseCode = http.POST(requestBody);

          // If you need an HTTP request with a content type: application/json, use the following:
          // http.addHeader("Content-Type", "application/json");
          // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

          // If you need an HTTP request with a content type: text/plain
          // http.addHeader("Content-Type", "text/plain");
          // int httpResponseCode = http.POST("Hello, World!");

          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode);

          // Free resources
          http.end();
        }
      }
    }

    inside_prev = inside_visitor;
  }

  if (outside_prev != outside_visitor)
  {
    int outside_coming = outside_visitor - outside_prev;

    if (outside_coming > 0)
    {
      // coming
      outside += 1;
      outside_lastedUpdate = millis();
    }
    else if (outside_coming < 0)
    {
      // exit
      if (inside > 0)
      {
        visitor -= 1;

        inside -= 1;
        outside -= 1;

        Serial.println(visitor);

        if (WiFi.status() == WL_CONNECTED)
        {
          WiFiClient client;
          HTTPClient http;

          // Your Domain name with URL path or IP address with path
          http.begin(client, "http://192.168.0.104:3000/api/v1/visitor/visitor-update/");

          // Specify content-type header
          http.addHeader("Content-Type", "application/json");
          // Data to send with HTTP POST
          StaticJsonDocument<200> doc;
          doc["roomID"] = 1;
          doc["userCurrent"] = visitor;
          doc["userDiff"] = -1;

          // Convert JSON object to string
          String requestBody;
          serializeJson(doc, requestBody);

          Serial.println(requestBody);

          // Send HTTP POST request
          int httpResponseCode = http.POST(requestBody);

          // If you need an HTTP request with a content type: application/json, use the following:
          // http.addHeader("Content-Type", "application/json");
          // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

          // If you need an HTTP request with a content type: text/plain
          // http.addHeader("Content-Type", "text/plain");
          // int httpResponseCode = http.POST("Hello, World!");

          Serial.print("HTTP Response code: ");
          Serial.println(httpResponseCode);

          // Free resources
          http.end();
        }
      }
    }

    outside_prev = outside_visitor;
  }

  delay(100);
}