---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-06-21T15:22:00+08:00'
excerpt: In this article, we will tackle about on how to control an electromagnet module with ESP32 using MicroPython. Electromagnet is an artificial kind of magnet that activates and or deactivates by the use of electricity.
tags:
  - ESP32
  - ESP8266
  - micropython electromagnet
  - micropython robot
series:
  - MicroPython TechNotes
title: '039 - MicroPython TechNotes: Electromagnet'
url: /2021/06/21/039-micropython-technotes-electromagnet/
---

## **Introduction**

![](/images/039-2B-2BMicroPython-2BTechNotes-2BElectromagnet.png)

In this article, we will tackle about on how to control an electromagnet module with ESP32 using MicroPython. **Electromagnet** is an artificial kind of magnet that activates and or deactivates by the use of electricity.

A **logic 1** enables the electromagnet module meaning it can attract metallic objects while a **logic 0** disables the electromagnet module.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 3-pin F-F dupont wires.
4. Gorillacell electromagnet module.

## **Pinout**

1. **G** – for the ground.
2. **V** – for the supply voltage of the electromagnet.
3. **S** – for the control signal pin for the electromagnet.

## **Pin Assignment**

For this lesson, I choose GPIO 23 to serve as the control signal pin for the electromagnet module.

## **Hardware Instruction**

1. Attach the ESP32 development board on top of the Gorillacell ESP32 shield and make sure that both USB port are on the same side.
2. Attach a dupont wires to the electromagnet module according to color coding that is black for the ground, red for the VCC, and yellow for the control signal pin.
3. Attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers such that black is to black, red is to red, and yellow is to yellow pin headers.
4. Power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Connect the ESP32 to the computer with a micro USB cable.

## **Video Demonstration**

{{< youtube Tt7ojwS3bAI >}}

## **Call To Action**

If you have any concern regarding this lesson, please write your message in the comment box provided.

If you found this article helpful, please consider supporting my journey on Youtube by Subscribing on my channel. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Have a good days ahead everyone.

Thanks,

## **Source Code**

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

electromagnet = Pin(23, Pin.OUT)


# ******************************************************************
# The following should be explored using the REPL:
# ******************************************************************
# # 1. To activate the electromagnet, set signal pin to logic 1
# electromagnet.value(1)

# # 2. To deactivate the electromagnet, set signal pin to logic 0
# electromagnet.value(0)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
    [https://gorillacell.kr](https://gorillacell.kr/)

