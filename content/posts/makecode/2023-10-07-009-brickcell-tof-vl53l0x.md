---
title: 009 - Brickcell TOF VL53L0X | MakeCode Microbit
url: /2023/10/07/brickcell_tof_vl53l0x/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-07T08:00:00+08:00'
tags:
  - MakeCode
  - microbit
  - Time-Of-Flight
  - tof
  - vl53l0x
---


## **Introduction**

The VL53L0X Time-of-Flight (ToF) sensor is a miniature, highly advanced distance sensor designed to measure distances accurately and quickly. It operates based on the principle of time-of-flight, where it emits a laser or infrared light pulse and measures the time it takes for the light to bounce back after hitting an object. This allows it to calculate the distance to the object in front of it with high precision.

VL53L0X ToF sensors are often used in various applications, including robotics, drones, gesture recognition systems, and even in smartphones for functions like proximity sensing and autofocus in cameras. They offer benefits like fast and accurate distance measurement, compact size, and low power consumption.

## **Hardware Instruction**

Let's explore how to connect the VL53L0X Time-Of-Flight distance sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the TOF distance sensor GND pin to microbit GND pin.
2. Connect the TOF distance sensor VCC pin to microbit VCC pin.
3. Connect the TOF distance sensor serial data pin (SDA) to microbit pin 20.
4. Connect the TOF distance sensor serial clock pin (SCL) to microbit pin 19.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the VL53L0X TOF distance sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "tof-vl53l0x-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-tof-vl53l0x/](https://github.com/gbantique/brickcell-tof-vl53l0x/) on the search bar.
5. Select the "brickcell-tof-vl53l0x" from the search results. The "tof vl53l0x" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
Brickcell.init()
basic.forever(() => {
    serial.writeNumber(Brickcell.distance())
    serial.writeString("\r\n")
    basic.pause(1000);
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S55676-77516-83467-70824" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S55676-77516-83467-70824/](https://makecode.microbit.org/S55676-77516-83467-70824/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured distance on the serial terminal every 1000 milliseconds.

