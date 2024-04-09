---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-06-02T09:50:00+08:00'
tags:
  - Arduino uno
  - corona virus
  - covid19
  - hc-sr04
  - mg996r
  - pandemic
  - servo motor
  - ultrasonic sensor
series:
  - My Arduino Exploration
title: 'Project: Automatic Alcohol Dispenser'
url: /2020/06/02/project-automatic-alcohol-dispenser/
---

## **Introduction**

This is my own version of automatic (No touch / touchless) alcohol / sanitizer dispenser. This is especially useful during this COVID19 pandemic. In here, we will be using an ultrasonic sensor to detect the presence of hand near the dispenser. When the ultrasonic sensor detects an object less than the set distance, it will rotate the attached servo motors to push the plunger of the dispenser.

## **Bill Of Materials**

1. Arduino Uno
2. HC-SR04 ultrasonic sensor
3. MG996R servo motor
4. Some wires, dispenser, some piece of wood.

![](/images/AlcoholDispenser.png)

## **Video Demonstration**

{{< youtube YDNmXjx8tbA >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "Servo.h"

#define ECHO_PIN 6
#define TRIG_PIN 7
#define SERVO_PIN 9

Servo myservo; // create servo object to control a servo
long duration, cm;

void setup() {
  // put your setup code here, to run once:
  Serial.begin (9600);
  pinMode(ECHO_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  myservo.attach(SERVO_PIN); // attaches the servo on pin 9 to the servo object
  myservo.write(60);
  delay(1000);
  Serial.println("SETUP Complete");
}

void loop() {
  // The sensor is triggered by a HIGH pulse of 10 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
 
  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  duration = pulseIn(ECHO_PIN, HIGH);
 
  // Convert the time into a distance
  cm = (duration/2) *0.0343;     // Speed of sound 0.0343 cm/usec
  myservo.write(60);
  if (cm <= 10) {
    myservo.write(120); // sets the servo position
  }
  delay(400);
}
```

## **Call To Action**

If you have any question, please do not hesitate to leave it in the comment box.
Please Subscribe to my Youtube channel so that you will not missed interesting tutorials like this.
Thank you and have a good day.
Happy tinkering.

