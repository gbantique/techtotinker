---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-02-13T17:03:00+08:00'
tags:
  - Arduino uno
  - bluetooth
  - electronics
  - HC-05
  - HC-06
  - hobby
  - interface
  - tinkering
series:
  - My Arduino Exploration
title: How to Interface HC-06 to Arduino
url: /2020/02/13/how-to-interface-hc-06-to-arduino/
---

## **Introduction**

Electronics projects nowadays usually needs a wireless communication interface. Bluetooth device is one of the most commonly use for this purpose. Today, I am going to show you on how to interface HC-06 bluetooth module to Arduino.

## **Bill Of Materials**  

1. HC-06 bluetooth module  
2. Arduino Uno board  
3. A couple of jumper wires

## **Hardware Instruction:**  

1. Connect the HC-06 VCC pin to +5V pin of Arduino Uno (please refer to the schematic below).  
2. Connect the HC-06 GND pin to GND pin of Arduino Uno.  
3. Connect the HC-06 TXD pin to pin 2 of Arduino Uno (functions as Rx).  
4. Connect the HC-06 RXD pin to pin 3 of Arduino Uno (fucntions as Tx).  
5. Connect the Arduino Uno to the computer.  
6. Run the Arduino IDE.  
7. Make sure Arduino Uno is selected under Tools &gt; Board.  
8. Select the correct serial port under Tools &gt; Port.  
9. Upload the sketch. Source code is provided below.
**This basically echoes the serial data through HC-06 to hardware serial of Arduino Uno and vice-versa.**

## **HC-06 Troubleshooting**  

1. Connect a jumper wire between HC-06 RXD and TXD.  
2. Connect +5V supply to VCC.  
3. Connect the supply ground to GND pin.  
4. Using a mobile / smart phone connect through a bluetooth to HC-06.  
5. Enter pin code 1234.
**This basically echoes whatever is received by the HC-06 to a bluetooth terminal.**

## **Call To Action**

If you find this lesson useful, please kindly visit my website and Youtube channel. Links provided below:  
1. [techtotinker.com](https://techtotinker.com/)  
2. [TechToTinker Youtube channel.](https://www.youtube.com/c/techtotinker)

## **Schematic Diagram**

![](/images/Getting-Started-with-HC-06.png)


## **Source Code**
```cpp { lineNos="true" wrap="true" }
#include <softwareserial.h>

SoftwareSerial hc06(2,3);
String cmd="";

void setup(){
 //Initialize Serial Monitor
 Serial.begin(9600);
 
 //Initialize Bluetooth Serial Port
 hc06.begin(9600);
 
 Serial.print("Setup DONE.");
}

void loop(){

  //Write data from HC06 to Serial Monitor
  if (hc06.available()){
    Serial.write(hc06.read());
  }
  
  //Write from Serial Monitor to HC06
  if (Serial.available()){
    hc06.write(Serial.read());
  }   

 delay(100);
}
```
