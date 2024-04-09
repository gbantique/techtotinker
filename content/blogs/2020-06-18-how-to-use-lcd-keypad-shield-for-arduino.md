---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-06-18T19:11:00+08:00'
tags:
  - Arduino
  - Arduino uno
  - lcd keypad shield
series:
  - My Arduino Exploration
title: How to Use LCD Keypad Shield for Arduino
url: /2020/06/18/how-to-use-lcd-keypad-shield-for-arduino/
---

## **Introduction**

In this tutorial, we will learn on how to use the LCD Keypad Shield for Arduino. This shield is compatible for Arduino Uno and Arduino Mega.

## **Pin assignments**

![](/images/LCDKeypadShield.png)

From this pin assignments, we can conclude that the following pins are free and available to be use for other purposes.
    
**Digital pins:** 0, 1, 2, 3, 11, 12, and 13.
**Analog pins:** A1 to A5.

## **Video Demonstration**  

{{< youtube Sf96riu27QI >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "LiquidCrystal.h"

LiquidCrystal lcd( 8,  9,  4,  5,  6,  7);

void setup() {
 lcd.begin(16, 2);
 lcd.setCursor(0,0);
 lcd.print("  TechToTinker  ");
 lcd.setCursor(0,1);
 lcd.print("Press Key:");
}

void loop() {
 int x;
 x = analogRead (0);
 lcd.setCursor(10,1);
 
 if (x < 60) {
   lcd.print ("Right ");
 }
 else if (x < 200) {
   lcd.print ("Up    ");
 }
 else if (x < 400){
   lcd.print ("Down  ");
 }
 else if (x < 600){
   lcd.print ("Left  ");
 }
 else if (x < 800){
   lcd.print ("Select");
 }
} 
```

## **Source Code**

If you find this tutorial helpful, like and share this to your friends who might benefit from it.
Thank you and have a good day.

