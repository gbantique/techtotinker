---
author: George Bantique
categories:
  - Arduino
  - Nano
  - Uno
date: '2020-02-12T19:21:00+08:00'
excerpt: I am fascinated how easy it is to build an mp3 player using a DF Player Mini. DF Player mini is a cheap mp3 player.
tags:
  - DF Player Mini
  - electronics
  - hobby
  - micro SD
  - MP3
  - Mp3 player
  - Speaker
  - tinkering
series:
  - My Arduino Exploration
title: 'Part 1: DF Player Mini - a mini cheap mp3 player'
url: /2020/02/12/part-1-df-player-mini-a-mini-cheap-mp3-player/
---

## **Introduction**

I am fascinated how easy it is to build an mp3 player using a DF Player Mini. DF Player mini is a cheap mp3 player.

![DF Player Mini image](/images/DF-Player-Mini-Pinout.png)

## **Bill Of Materials**

1. DF Player mini  
2. Breadboard  
3. Battery / power supply  
4. Speaker  
5. A couple of jumper wires  
6. A micro SD card with some mp3 files loaded.

## **Hardware Instruction**

1. Insert the micro SD card to the DF player mini.  
2. Place the DF player mini to the breadboard.  
3. Connect power supply +5V to VCC pin (pin 1, please refer to below picture)  
4. Connect power supply ground to GND pin (pin 7).  
5. Connect the speaker – pin to SPK\_1 (pin 6) and speaker + pin to SPK\_2 pins (pin 8).  
6. Connect a jumper wire to GND pin (pin 10)

## **Basic Operation**

So basically, IO\_1 and IO\_2 is used as follows:  
1. short press IO\_1: play previous  
2. long press IO\_1: volume down  
3. short press IO\_2: play next  
4. long press IO\_2: volume up

## **Schematic Diagram**

![](/images/DF-Player-Mini-Schematic.png)

## **Video Demonstration**

{{< youtube e8XMp5vUS2E >}}

## **Call To Action**

If you have any concern regarding this lesson, be sure to write your message in the comment section.

You might also like to support me on my journey on Youtube by Subscribing. [Click this link to SUBSCRIBE to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

May you have a blessed day.

Thank you,

George Bantique | tech.to.tinker@gmail.com

## **References And Credits**

1. [Part 2: DF Player Mini Tinkering with Arduino Nano](https://tech-to-tinker.blogspot.com/2020/02/part-2-df-player-mini-tinkering-with.html)

