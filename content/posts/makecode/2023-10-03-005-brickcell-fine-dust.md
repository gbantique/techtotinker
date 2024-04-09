---
title: 005 - Brickcell Fine Dust | MakeCode Microbit
url: /2023/10/03/brickcell_fine_dust/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-03T10:47:00+08:00'
tags:
  - MakeCode
  - microbit
---


## **Introduction**

Fine Dust sensor also known as Particulate Matter(PM) sensor is a device used to measure the concentration of fine particulate matter in the air. Fine particulate matter refers to tiny, airborne particles or droplets that can be inhaled into the respiratory system and can have adverse effects on human health and the environment. These particles are often categorized based on their size, with PM2.5 and Pm10 begin common size classifications.

### **Particle Detection**

The sensor contains a mechanism for detecting airborne particles. This can be done using various methods, including light scattering, laser technology, or electrical charges.

### **Data Processing**

Once particles are detected, the sensor processes the data to quantify the concentration of particulate matter in the air. It can differentiate between different particle sizes, such as PM2.5 (particles with a diameter of 2.5 micrometers or smaller) and PM10 (particles with a diameter of 10 micrometers or smaller).

### **Output**

The sensor provides output in the form of concentration measurements, often in units such as micrograms per cubic meter or other relevant units. This data can be displayed on a screen or transmitted to a monitoring system for further analysis.

## **Hardware Instruction**

Let's explore how to connect the Fine Dust sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Fine Dust sensor GND pin to microbit GND pin.
2. Connect the Fine Dust sensor VCC pin to microbit VCC pin.
3. Connect the Fine Dust sensor voltage output pin (Vo) to microbit pin 0.
4. Connect the Fine Dust sensor led control (LED) to microbit pin 1.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the Fine Dust sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "dust-gp2y10-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-dust-gp2y10/](https://github.com/gbantique/brickcell-dust-gp2y10/) on the search bar.
5. Select the "brickcell-dust-gp2y10" from the search results. The "fine dust" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
Brickcell.initializeFineDustSensor(AnalogPin.P0, DigitalPin.P1)
serial.setBaudRate(BaudRate.BaudRate115200)
basic.forever(function () {
    serial.writeNumber(Brickcell.readFineDust())
    serial.writeString("" + ("\r\n"))
    basic.pause(2000)
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S02369-13902-13078-44505" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S02369-13902-13078-44505/](https://makecode.microbit.org/S02369-13902-13078-44505/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured air particles on the serial terminal every 2000 milliseconds.

