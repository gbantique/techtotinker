---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-04-03T16:54:00+08:00'
tags:
  - Arduino
  - Arduino uno
  - electronic DIY
  - electronic hobbyist
  - electronics
  - hobby
  - software serial
series:
  - My Arduino Exploration
title: What is Arduino Software Serial
url: /2020/04/03/what-is-arduino-software-serial/
---

## **Introduction**

I feel obligated to post this tutorial after seeing beginners assigning two serial devices to Arduino Uno hardware serial pin which is digital pin 0 (Rx) and digital pin 1 (Tx). Connecting two serial devices results to undefined behavior due to conflicting signals. Arduino Uno, Arduino Nano, and Arduino Mini has only 1 serial port. If you need to connect more serial devices, you have the option to use their big brother; the Arduino Mega which has four serial ports and more pins available. But using the Arduino Mega results to additional cost. The other option is to use the Arduino Software Serial library.

Arduino Software Serial library basically mimics or copy the behavior of the hardware serial. We are going to use the library of PaulStoffregen from <https://github.com/PaulStoffregen/SoftwareSerial>. With SoftwareSerial, we can assign another set of pins for serial devices.

Please download the library then add it by clicking the Sketch &gt; Include Library &gt; Add ZIP Library and select the downloaded SoftwareSerial library.

![](/images/AddingLibrary.png)

## **Hardware Instruction**

![](/images/SoftwareSerial-Schematic.png)

1. Connect the Arduino Uno pin 2 to USB-Serial converter Tx pin. 
2. Connect the Arduino Uno pin 3 to USB-Serial converter Rx pin.
3. Connect the supply voltage to USB-Serial converter.
4. Upload the sketch provided below in the source code section. This sketch should function as follows:
    * Data sent from hardware serial port should be receive in software serial port.
    * Data sent from software serial port should be receive in hardware serial port.
5. Please feel free to modify and experiment with the source code to maximize learning.

## **Video Demonstration**  

{{< youtube _LF2ySZ_omk >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "SoftwareSerial.h"

SoftwareSerial swSerial(2,3);

void setup(){
    //Initialize HARDWARE serial port
    Serial.begin(9600);
    //Initialize SOFTWARE serial port
    swSerial.begin(9600);
    Serial.print("Setup DONE.");
}

void loop(){
    // If there is data from software serial
    if (swSerial.available()){
        Serial.write(swSerial.read());  // Write it to hardware serial
    }
  
    // If there is data from hardware serial
    if (Serial.available()){
        swSerial.write(Serial.read());  // Write it to software serial
    }   
}
```

## **Call To Action**

If you find this tutorial helpful, please consider supporting my Youtube channel techtotinker.com. Please leave your comments and suggestions in the comment box.
Thank you and have a good day. Happy tinkering.

