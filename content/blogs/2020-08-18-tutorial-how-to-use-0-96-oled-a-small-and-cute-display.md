---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-08-18T19:15:00+08:00'
series:
  - My Arduino Exploration
title: 'Tutorial: How to use 0.96 OLED - a small and cute display'
url: /2020/08/18/tutorial-how-to-use-0-96-oled-a-small-and-cute-display/
---

## **Specifications**

**Description**: 0.96 inch monochrome OLED display  
**Resolution**: 128×64 pixels  
**Dimension**: WxHxT 27.3 mm x 27.8 mm x 4.3 mm  
**Protocol**: I2C  
**Operating Voltage**: 3V to 5V

**Common variations of this OLED module:**  
1. **Different monochrome color:** white, blue, yellow  
2. **Different resolution:** 128×64 and 128×32 pixels  
3. **Different communication protocol:** I2C and SPI  
4. **Different driver IC:** SSD1306 and SSH1106  
5. **Some has additional reset pin.**

## **Circuit Diagram**

![](/images/oled_circuit.png)

links of libraries:
[https://github.com/adafruit/Adafruit\_SSD1306](https://github.com/adafruit/Adafruit_SSD1306)
[https://github.com/adafruit/Adafruit-GFX-Librar](https://github.com/adafruit/Adafruit-GFX-Library)

## **Video Demonstration**

{{< youtube jc2H60R9qnlc >}}

## **Call To Action**

If you have any question regarding this tutorial, please do not hesitate to write it in the comment box below and I will be happy to answer it.

If you like this video, please kindly consider supporting me by Subscribing to TechToTinker Youtube channel. [Click this to SUBSCRIBE.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good day.

## **Source Code**

```cpp { lineNos="true" wrap="true" }
// Load the libraries for the DHT sensor
#include "Wire.h"
#include "DHT.h"
#include "Adafruit_Sensor.h"

// Load the libraries for the OLED display 
#include "Adafruit_GFX.h"
#include "Adafruit_SSD1306.h"

// OLED display size in pixels
#define SCREEN_WIDTH 128 
#define SCREEN_HEIGHT 64 

// DHT11 data pin assignment
#define DHTPIN A0

// Define the type of sensor to be use
#define DHTTYPE    DHT11     // DHT 11
//#define DHTTYPE    DHT22     // DHT 22 (AM2302)
//#define DHTTYPE    DHT21     // DHT 21 (AM2301)

// Create the "oled" object
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Create the "dht" object
DHT dht(DHTPIN, DHTTYPE);

// Declare global variables here 
float temperature;
float humidity;

void setup() {
  // Initialized the Serial
  Serial.begin(115200);

  // Initialized the DHT11
  dht.begin();

  // Initialized the OLED
  if(!oled.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 failed"));
    for(;;);
  }

  oled.clearDisplay();
  oled.setTextColor(WHITE);
}

void loop() {
  // Get the sensor readings
  getSensorValue();

  // and display it to the oled
  updateDisplay();

  // Delay for some time
  delay(3000);
}

void getSensorValue() {
  // Get the temperature and humidity sensor readings
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT sensor failed");
  }  
}

void updateDisplay() {
  // Clear the display
  oled.clearDisplay();

  // Display the current temperature
  oled.setTextSize(1);
  oled.setCursor(0,0);
  oled.print("Temperature: ");
  oled.setTextSize(2);
  oled.setCursor(0,10);
  oled.print(temperature);
  oled.print(" ");
  oled.setTextSize(1);

  // Enable the Code Page 437
  // https://en.wikipedia.org/wiki/Code_page_437
  oled.cp437(true);

  // Then print the chosen characters
  // which in this case is the degrees symbol
  // https://www.ascii-codes.com/
  oled.write(248);
  oled.setTextSize(2);
  oled.print("C");
  
  // Display the current humidity
  oled.setTextSize(1);
  oled.setCursor(0, 35);
  oled.print("Humidity: ");
  oled.setTextSize(2);
  oled.setCursor(0, 45);
  oled.print(humidity);
  oled.print(" %"); 

  // Update and show the display
  oled.display();   
}
```

