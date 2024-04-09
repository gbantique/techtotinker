---
title: 004 - Brickcell Ultrasonic HCSR04 | MakeCode Microbit
url: /2023/10/02/brickcell_ultrasonic_hcsr04/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-02T10:47:00+08:00'
tags:
  - MakeCode
  - microbit
---


## **Introduction**

Ultrasonic sensors are devices that uses ultrasonic sound waves to measure distance and/or detect an object. They are a type of proximity sensor that works on the principle of echolocation, similar to how bats and dolphins navigate in the dark. These sensors emit high-frequency sound waves (ultrasonic waves) that are beyond the range of human hearing, and then listen for the echoes produced when these waves bounce off objects. By measuring the time it takes for  the sound waves to travel to the object and back, we can calculate distances with accuracy.

### **Working Principle**

The HC-SR04 sensor is consists of two main components: a transmitter and a receiver. The transmitter emits a burst of ultrasonic waves, while the receiver listens for the echoes. By measuring the time delay between sending the waves and receiving their echoes, the sensor can determine the distance to an object.

### **Measurement Range**

Typically, the HC-SR04 can accurately measure distances within a range of 2 centimeters to 400 centimeters, depending on the specific model and environmental conditions.

### **Output**

When the sensor successfully detects an object and calculates the distance, it typically provides this information as a digital signal on its output pin. The duration of the output pulse is proportional to the measured distance.

## **Hardware Instruction**

Let's explore how to connect the HC-SR04 Ultrasonic distance sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Ultrasonic sensor GND pin to microbit GND pin.
2. Connect the Ultrasonic sensor VCC pin to microbit VCC pin.
3. Connect the Ultrasonic sensor trigger pin (TRIG) to microbit pin 12.
4. Connect the Ultrasonic sensor echo pin (ECHO) to microbit pin 13.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the HC-SR04 Ultrasonic distance sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "ultrasonic-hcsr04-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-ultrasonic-hcsr04/](https://github.com/gbantique/brickcell-ultrasonic-hcsr04/) on the search bar.
5. Select the "brickcell-ultrasonic-hcsr04" from the search results. The "ultrasonic hcsr04" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
serial.setBaudRate(BaudRate.BaudRate115200);

basic.forever(function () {
    let _distance_cm = Brickcell.readDistance(DigitalPin.P12, DigitalPin.P13);

    serial.writeLine("" + _distance_cm);
    basic.showNumber(_distance_cm);
    basic.pause(2000);
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S43150-94172-61155-97827" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S43150-94172-61155-97827/](https://makecode.microbit.org/S43150-94172-61155-97827/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured distance in centimeter on the serial terminal every 2000 milliseconds.

