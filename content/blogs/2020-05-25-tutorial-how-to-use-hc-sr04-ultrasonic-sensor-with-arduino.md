---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-05-25T12:30:00+08:00'
tags:
  - Arduino uno
  - distance measurement sensor
  - hc-sr04
  - ultrasonic sensor
series:
  - My Arduino Exploration
title: 'TUTORIAL: How to use HC-SR04 Ultrasonic Sensor with Arduino'
url: /2020/05/25/tutorial-how-to-use-hc-sr04-ultrasonic-sensor-with-arduino/
---

## **Introduction**

This tutorial is about the commonly use HC-SR04 ultrasonic sensor. We will give some details about it, explain how it works, and at the last part we will create an Arduino sketch to test its functionality.

![](/images/HC-SR04-image.png)

**HOW HC-SR04 WORKS:**  
The HC-SR04 ultrasonic sensor uses a sound frequency to determine distance of an object just like how dolphins and bats senses its surroundings for navigation. Ultrasonic sound frequency can be found just above the upper limit of human hearing capacity (20 Hz to 20 KHz).

Ultrasonic sensors is composed of 2 sound transducers, one for transmitter and another one for receiver. So, how does it work?
1. The transmitter sends a signal and when the signal hits an object, the signal is reflected.
2. The reflected signal is then receive by the receiver.

![](/images/HC-SR04-Illustration.png)

The time it takes for the transmitted signal to be reflected back to the sensor is proportionally equivalent to the distance it travels according to the speed of sound.

To determine the distance of an object, we will use the following formula:

 **distance = duration x speed of sound**

But, we need to consider that the signal is sent, hits an object, then reflected back. So taking it in consideration, we will use the following formula instead:
The speed of sound is **343 m/sec** or **0.0343 cm/µsec** since the returned value of ultrasonic sensor is in micro seconds.

## **Pin Assignment**

1. VCC: +5V DC
2. Trig: Trigger pin is an input signal used to activate the sending of ultrasonic signal burst.
3. Echo: Echo pin is an output signal which returns a TTL HIGH equivalent to the duration of travel from transmitting to receiving.
4. GND: Ground pin

The HC-SR04 provides a distance measurement between 2 cm to 400 cm with an accuracy of 3mm at a maximum angle of 15 degrees. For more details, you may check the datasheet (links will be provided n the description).  
\[<https://www.electroschematics.com/wp-content/uploads/2013/07/HCSR04-datasheet-version-1.pdf>\]

## **Bill Of Materials**

For this example, we will need the following materials to test its funtionality:
1. An Arduino Uno board as the main controller.
2. The HC-SR04 Ultrasonic sensor.
3. Some jumper wires.

![](/images/HC-SR04-CircuitDiagram.png)

## **Hardware Instruction**

So lets build our circuit,
1. Connect the VCC pin of HC-SR04 to 5V pin of Arduino Uno.
2. Connect the Trig pin of HC-SR04 to digital pin 9 of Arduino Uno.
3. Connect the Echo pin of HC-SR04 to digital pin 10 of Arduino Uno.
4. Connect the GND pin of HC-SR04 to GND pin of Arduino Uno.

Now, let us prepare our Arduino code,
1. Copy and paste the provided Arduino code to your Arduino IDE.
2. Connect the Arduino Uno to your computer and make sure that the correct board is selected under Tools &gt; Board. Also make sure that the correct serial port is selected under Tools &gt; Port.
3. Upload the sketch and if everything is ok, you should be able to see the measured distance of the HC-SR04 ultrasonic sensor in your Serial Monitor.

## **Video Demonstration**

{{< youtube NwMDtrWotsw >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#define ECHO_PIN 10
#define TRIG_PIN 9

long duration, distance;

void setup() {
  Serial.begin (9600);
  pinMode(ECHO_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
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
  distance = (duration/2) * 0.0343;     // speed of sound is 0.0343 cm/us

  // Now send it to Serial monitor
  Serial.print("Distance is ");
  Serial.print(distance);
  Serial.println(" cm.");
  delay(1000);
}

```

## **Call To Action**

If you find this tutorial helpful, please consider helping me by sharing this to your friends. If you have any question, please do not hesitate to leave it in the comments section.

Thank you and have a good day.

Happy tinkering!

