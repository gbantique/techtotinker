---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-06-21T16:37:00+08:00'
tags:
  - Android app
  - Android application
  - Arduino
  - Arduino uno
  - bluetooth module
  - HC-06
  - MIT App Inventor
series:
  - My Arduino Exploration
title: MIT App Inventor for Arduino
url: /2020/06/21/mit-app-inventor-for-arduino/
---

## **Introduction**

Building an Android application is one option to control your robot project or anything that comes to your mind. And with the use of the MIT App Inventor 2, you can easily create an Android application.

In this tutorial, we will learn to create a simple Android application which can control the state of the LED connected to Arduino Uno board. Bluetooth communication protocol will be use via HC-06 bluetooth module.

In the Arduino Uno, we will create a circuit according to the following diagram:

![](/images/For_MIT_App_Inventor_test.png)

## **Source Code**

```cpp { lineNos="true" wrap="true" }

#include "SoftwareSerial.h"

#define LED_PIN 13
#define HC06_RX 2
#define HC06_TX 3

SoftwareSerial HC06(HC06_RX,HC06_TX);

bool LED_STATE = false;
String cmd = "";

void setup() {
  // put your setup code here, to run once:
  HC06.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LED_STATE);
}

void loop() {
  // put your main code here, to run repeatedly:
  while(HC06.available()>0){
   cmd+=(char)HC06.read();
  }

  if(cmd!=""){
    cmd.trim();  // Remove added LF in transmit
    // We expect Command from bluetooth
    if (cmd.equals("1")) {
      LED_STATE = true;
    } else if (cmd.equals("0")) {
      LED_STATE = false;
    }

    cmd=""; //reset cmd
  }

  digitalWrite(LED_PIN, LED_STATE);
}
```

**MIT App Inventor**

Follow the following sketch for the MIT App Inventor.

![](/images/MITApp-Setup1.png)

![](/images/MITApp-Setup2.png)

![](/images/MITApp-Disconnect.png)

![](/images/MITApp-TurnON.png)

![](/images/MITApp-TurnOFF.png)

You may download the Android application here:
[DOWNLOAD THE ANDROID APP](https://drive.google.com/file/d/1B0P0TVVacaOAiNk-2dmj7DjeB3j_-U1k/view?usp=sharing)

## **Video Demonstration**

**Part 1:**

{{< youtube Gb9nCv1b1_I >}}

**Part 2:**

{{< youtube kN3Zc-FFaTI >}}

## **Call To Action**

I hope I am able to impart a little information to you, but if you have any question, please do not hesitate to leave your question in the comment box.
Thank you and have a good day.
Happy tinkering.

