---
title: 013 - Brickcell Gesture APDS9960 | MakeCode Microbit
url: /2023/10/17/brickcell_gesture_apds9960/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-17T09:20:00+08:00'
tags:
  - MakeCode
  - microbit
  - gesture sensor
  - apds9960
---


## **Introduction**

The APDS9960 is a digital RGB (Red, Green, Blue) and gesture sensor manufactured by Broadcom, which is now part of Avago Technologies. This sensor is designed to detect hand gestures, proximity, and ambient light, making it useful for applications such as touchless gesture-controlled interfaces in electronic devices. It operates by emitting infrared light and measuring the reflection to detect hand movements. The APDS9960 can be found in various consumer electronics and IoT devices, enabling touchless control and interaction with them.

## **Hardware Instruction**

Let's explore how to connect the Gesture Sensor module to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Gesture Sensor GND pin to microbit GND pin.
2. Connect the Gesture Sensor VCC pin to microbit 5V pin.
3. Connect the Gesture Sensor serial data pin (SDA) to microbit pin 20.
4. Connect the Gesture Sensor serial clock pin (SCL) to microbit pin 19.
5. Leave the Gesture Sensor interrupt pin (INT) unconnected (no connected).

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the Gesture Sensor module.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "gesture-apds9960-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-gesture-apds9960/](https://github.com/gbantique/brickcell-gesture-apds9960/) on the search bar.
5. Select the "brickcell-gesture-apds9960" from the search results. The "gesture apds9960" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
Brickcell.onGesture(BrickcellGesture.Down, function () {
    serial.writeLine("down")
})
Brickcell.onGesture(BrickcellGesture.Right, function () {
    serial.writeLine("right")
})
Brickcell.onGesture(BrickcellGesture.Up, function () {
    serial.writeLine("up")
})
Brickcell.onGesture(BrickcellGesture.Left, function () {
    serial.writeLine("left")
})
serial.setBaudRate(BaudRate.BaudRate115200)
serial.writeString("Setup starting...")
Brickcell.init()
```

7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S67898-45195-03980-78151" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S67898-45195-03980-78151/](https://makecode.microbit.org/S67898-45195-03980-78151/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the detected gesture in the serial terminal. Baud rate should be set to 115200 bps.

