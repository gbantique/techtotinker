---
author: George Bantique
categories:
  - Arduino
  - ESP32
date: '2020-08-10T19:20:00+08:00'
tags:
  - ESP32
  - internet of things
  - IOT
series:
  - ESP32 using Arduino
title: 'Tutorial: ESP32 Web Server | Control something through ESP32 WiFi in Station Mode'
url: /2020/08/10/tutorial-esp32-web-server-control-something-through-esp32-wifi-in-station-mode/
---

## **Introduction**

ESP32 has a WIFI capability where we can take advantage for controlling anything remotely

In this tutorial we will learn how to use ESP32 to host a website for controlling anything lets say turning ON or OFF of the light at home. In this video, we will just use LEDs for demonstration. If you decided to use it in the actual application, you may connect a relay instead of the LED.

## **Circuit Diagram**

![](/images/ESP32_WebServer_STA.png)

## **Video Demonstration**

{{< youtube Lqn2J7LesCY >}}

## **Call To Action**

If you have any question, please write it in the comment box so I may try it to the best I can do. Please LIKE, SHARE, and SUBSCRIBE.

Thank you and have a good day.

## **Source Code**

```cpp { lineNos="true" wrap="true" }
 
 /*  Simple ESP32 Web Server
 *    The ESP32 Wifi is configured as station mode.
 *    
 */
 #include <WiFi.h>  
   
 #define BLUE_LED  25  
 #define GREEN_LED  26  
 #define RED_LED   27  
   
 // Create the objects for server and client  
 WiFiServer server(80);  
 WiFiClient client;  
   
 const char* ssid   = "your ssid";  
 const char* password = "your password";  
   
 // Create the global variable  
 String http;  
 String bluLedState = "off";  
 String grnLedState = "off";  
 String redLedState = "off";  
   
 void setup() {  
  Serial.begin(115200);  
  pinMode(BLUE_LED, OUTPUT);  
  pinMode(GREEN_LED, OUTPUT);  
  pinMode(RED_LED, OUTPUT);  
  digitalWrite(BLUE_LED, LOW);  
  digitalWrite(GREEN_LED, LOW);  
  digitalWrite(RED_LED, LOW);  
  Serial.print("Connecting to ");  
  Serial.println(ssid);  
   
  // Connect the Wifi to the router  
  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {  
   delay(500);  
   Serial.print(".");  
  }  
   
  Serial.println("");  
  Serial.println("WiFi connected.");  
  Serial.println("IP address: ");  
  Serial.println(WiFi.localIP());  
   
  // Start our ESP32 server  
  server.begin();  
 }  
   
 void loop(){  
    
  if ( client = server.available() ) {  // Checks if a new client tries to connect to our server  
   Serial.println("New Client.");  
   String clientData = "";  
   while ( client.connected() ) {      // Wait until the client finish sending HTTP request  
    if ( client.available() ) {        // If there is a data,  
     char c = client.read();           //  read one character  
     http += c;                        //  then parse it  
     Serial.write(c);    
     if (c == 'n') {                  // If the character is carriage return,   
                                       //  it means end of http request from client  
      if (clientData.length() == 0) {  //  Now that the clientData is cleared,  
       sendResponse();                 //    perform the necessary action  
       updateLED();  
       updateWebpage();  
       break;  
      } else {  
       clientData = "";               //  First, clear the clientData  
      }  
     } else if (c != 'r') {          // Or if the character is NOT new line  
      clientData += c;                //  store the character to the clientData variable  
     }  
    }  
   }   
   http = "";  
   client.stop();                     // Disconnect the client.  
   Serial.println("Client disconnected.");  
   Serial.println("");  
  }  
 }  
   
 void sendResponse() {  
  // Send the HTTP response headers  
  client.println("HTTP/1.1 200 OK");  
  client.println("Content-type:text/html");  
  client.println("Connection: close");  
  client.println();   
 }  
   
 void updateWebpage() {  
  // In here we will display / update the webpage by sending the HTML   
  //  to the connected client  
  // In order for us to use the HTTP GET functionality,  
  //  the HTML hyperlinks or href is use in the buttons.   
  //  So that, when you press the buttons, it will send a request to the   
  //  web server with the href links by which our ESP32 web server will  
  //  be check using HTTP GET and execute the equivalent action  
    
  // Send the whole HTML  
  client.println("<html>");  
  client.println("<head>");  
  client.println("<title>ESP32 WiFi Station</title>");  
  client.println("</head>");  
    
  // Web Page Heading  
  client.println("<body><h1>Simple ESP32 Web Server</h1>");  
   
  // Display buttons for Blue LED  
  client.println("<p>1. Blue LED is " + bluLedState + "</p>");    
  if (bluLedState == "off") {  
   client.println("<p><a href="/BLUE_LED/on"><button>Turn ON</button></a></p>");  
  } else {  
   client.println("<p><a href="/BLUE_LED/off"><button>Turn OFF</button></a></p>");  
  }   
   
  client.print("<hr>");  
    
  // Display buttons for Green LED  
  client.println("<p>2. Green LED is " + grnLedState + "</p>");    
  if (grnLedState == "off") {  
   client.println("<p><a href="/GREEN_LED/on"><button>Turn ON</button></a></p>");  
  } else {  
   client.println("<p><a href="/GREEN_LED/off"><button>Turn OFF</button></a></p>");  
  }   
   
  client.print("<hr>");  
      
  // Display buttons for Red LED  
  client.println("<p>3. Red LED is " + redLedState + "</p>");    
  if (redLedState == "off") {  
   client.println("<p><a href="/RED_LED/on"><button>Turn ON</button></a></p>");  
  } else {  
   client.println("<p><a href="/RED_LED/off"><button>Turn OFF</button></a></p>");  
  }  
   
  client.println("</body></html>");  
  client.println();  
 }  
   
 void updateLED() {  
  // In here we will check the HTTP request of the connected client  
  //  using the HTTP GET function,  
  //  Then turns the LED on / off according to the HTTP request  
  if    (http.indexOf("GET /BLUE_LED/on") >= 0) {  
   Serial.println("Blue LED on");  
   bluLedState = "on";  
   digitalWrite(BLUE_LED, HIGH);  
  } else if (http.indexOf("GET /BLUE_LED/off") >= 0) {  
   Serial.println("Blue LED off");  
   bluLedState = "off";  
   digitalWrite(BLUE_LED, LOW);  
  } else if (http.indexOf("GET /GREEN_LED/on") >= 0) {  
   Serial.println("Green LED on");  
   grnLedState = "on";  
   digitalWrite(GREEN_LED, HIGH);  
  } else if (http.indexOf("GET /GREEN_LED/off") >= 0) {  
   Serial.println("Green LED off");  
   grnLedState = "off";  
   digitalWrite(GREEN_LED, LOW);  
  } else if (http.indexOf("GET /RED_LED/on") >= 0) {  
   Serial.println("Red LED on");  
   redLedState = "on";  
   digitalWrite(RED_LED, HIGH);  
  } else if (http.indexOf("GET /RED_LED/off") >= 0) {  
   Serial.println("Red LED off");  
   redLedState = "off";  
   digitalWrite(RED_LED, LOW);  
  }  
 }  

```

