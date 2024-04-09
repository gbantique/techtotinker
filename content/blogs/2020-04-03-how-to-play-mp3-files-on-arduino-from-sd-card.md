---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-04-03T17:56:00+08:00'
tags:
  - Arduino uno
  - electronics
  - hobby
  - internet of things
  - microcontroller
  - Mp3 player
  - SD card
  - tinkering
series:
  - My Arduino Exploration
title: How To Play MP3 Files on Arduino from SD Card
url: /2020/04/03/how-to-play-mp3-files-on-arduino-from-sd-card/
---

## **Introduction**

After successfully accessing the SD Card with Arduino Uno the crude way (by soldering directly to SD card pins), I thought of making an mp3 player :). As a caveat, this design is not recommended for a daily mp3 player but it does play and I am happy with it. So let’s prepare the following materials:  

## **Bill Of Materials**

1. Arduino Uno (or any microcontroller you are comfortable with).  
2. SD card loaded with mp3 file.  
3. A speaker (optional audio amplifier).  
4. 3 pieces tactile switch for player control.  
5. Breadboard.  
6. Some jumper wires.  
7. Source code provided below.

So let us begin by:

## **Hardware Instruction**

1. First, make the necessary soldering of jumper wires to the SD card. Please refer to the schematic below. You may also break out the SD card cover to expose its internal parts. This is to make soldering easier. I suggest to make the connection from inside so that you may still connect the SD card to a computer for transferring of files (please refer to what I did).

![](/images/SDCard-Solder-For-SPI.png)

### **Please take note of the following:**

* SD card pin 1 (C/S pin) is connected with (green) wire to Arduino Uno pin 10.
* SD card pin 2 (MOSI pin) is connected with (blue) wire to Arduino Uno pin 11.
* SD card pin 3 and pin 6 (VSS pin) is connected with (violet) wire to Arduino Uno GND pin.
* SD card pin 4 (VDD pin) is connected with (dark gray) wire to Arduino Uno +3.3V pin (but I believe you can also use 5V, but Im not sure with regards to this).
* SD card pin 5 (SCK pin) is connected with (light gray) wire to Arduino Uno pin 13.
* SD card pin 7 (MISO pin) is connected with (black) wire to Arduino Uno pin 12.

2. Connect the speaker to Arduino Uno as follows:  
* Speaker (+) pin to Arduino Uno pin 9.  
* Speaker (-) pin to Arduino Uno GND pin.  

3. Connect the Arduino Uno to a computer.
* Run the Arduino IDE.
* Make sure “Arduino Uno” is selected under Tools &gt; Board.
* Check that the correct serial port is selected under Tools &gt; Port.

4. Upload the following sketch. After successfully uploading the sketch to our microcontroller, it should function as follows:  
* Pressing the first button should play the previous mp3 file.  
* Pressing the middle button should play / pause the currently playing mp3 file.  
* Pressing the third button should play the next mp3 file.  
* Long pressing the first button should decrease the volume.  
* Long pressing the third button should increase the volume.  

5. Lastly, feel free to modify the source code for learning and fun.

## Video Demonstration:

_insert video here_

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "SD.h"
#include "TMRpcm.h"
#include "SPI.h"

#define SD_ChipSelectPin 10
#define spkrPin 9

TMRpcm tmrpcm;

void setup() {
  tmrpcm.speakerPin = spkrPin;
  SD.begin(SD_ChipSelectPin);
  tmrpcm.setVolume(6);
  tmrpcm.play("CannotBe.wav");
  delay(3000);
}

void loop() {
  tmrpcm.play("AyeSir.wav");
  delay(3000);  
}

```

## **Call To Action**

If you find this lesson helpful, please consider supporting my Youtube channel: tech-to-tinker. You may also leave your comments and suggestions in the comment box below.

Thank you and have a good day.

Happy tinkering!

