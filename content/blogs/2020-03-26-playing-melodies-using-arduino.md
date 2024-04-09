---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-03-26T21:04:00+08:00'
tags:
  - Arduino Tone
  - Arduino uno
  - electronics
  - hobby
  - playing melodies
  - Speaker
  - tinkering
series:
  - My Arduino Exploration
title: Playing Melodies Using Arduino
url: /2020/03/26/playing-melodies-using-arduino/
---

## **Introduction**

Today we are going to tinker something easy and simple but interesting. We will be exploring something musical by taking advantage of microcontrollers capability to produce voltage signals. Our goal is to produce a melody using and Arduino Uno and a speaker.

The theory behind this is by generating a square wave signal and controlling its duration, we are essentially varying the voltage supplied to the speaker. With this we are going to use the Arduino Tone function.

As per Arduino Tone function documentation, a single pin can produce a frequency around  
31Hz to 65,535 kHz. According to our scientist humans can hear frequency from 20 Hz to 20,000 Hz but we hear best on frequency from 1,000 Hz to 5,000 Hz. This is human speaking frequency.

As a caveat, I am not a musician or a musically inclined person so please pardon my limitations with regards to music especially with this tinkering. 🙂

## **Bill Of Materials**  

1. Arduino Uno microcontroller.  
2. A speaker (we are not going to use any audio amplifier to simplify our circuits, but please feel free to use one).

## **Hardware Instruction**  

1. Connect the +pin of the speaker to Arduino Uno pin 9.  
2. Connect the other pin of the speaker to Arduino GND pin.  
3. Connect the Arduino Uno board to computer.  
4. Select “Arduino Uno” under Tools &gt; Board.  
5. Make sure that the correct serial port is selected under Tools &gt; Port.  
6. Upload the sketch using the source code provided.  
7. Enjoy.

## **Schematic Diagram**  

![](/images/Playing-Melodies-Using-Arduino-SCHEM.png)

## **Video Demonstration**  

{{< youtube WbDgJpO971k >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }

/*
  Plays a melody

  created 21 Jan 2010
  modified 30 Aug 2011
  by Tom Igoe

  This example code is in the public domain.
  http://www.arduino.cc/en/Tutorial/Tone
*/

#include "pitches.h"

int melody[] = {
  NOTE_E7, NOTE_E7, 0, NOTE_E7,
  0, NOTE_C7, NOTE_E7, 0,
  NOTE_G7, 0, 0,  0,
  NOTE_G6, 0, 0, 0,

  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,

  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0,

  NOTE_C7, 0, 0, NOTE_G6,
  0, 0, NOTE_E6, 0,
  0, NOTE_A6, 0, NOTE_B6,
  0, NOTE_AS6, NOTE_A6, 0,

  NOTE_G6, NOTE_E7, NOTE_G7,
  NOTE_A7, 0, NOTE_F7, NOTE_G7,
  0, NOTE_E7, 0, NOTE_C7,
  NOTE_D7, NOTE_B6, 0, 0
};

//Mario main them tempo
int noteDurations[] = {
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  9, 9, 9,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,

  9, 9, 9,
  12, 12, 12, 12,
  12, 12, 12, 12,
  12, 12, 12, 12,
};



void setup() {
  // iterate over the notes of the melody:
  for (int thisNote = 0; thisNote < 25; thisNote++) {

    // to calculate the note duration, take one second divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(9, melody[thisNote], noteDuration);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
 
    delay(pauseBetweenNotes);
    // stop the tone playing:
    noTone(9);
  }
}

void loop() {
  // no need to repeat the melody.

}

```

## **Call To Action**

Please feel free to modify the source code to your liking. You may try to imitate your favorite melodies by changing the melody array and its respective noteDuration arrays.

If you find this lesson useful, please support my channel by Subscribing. Please click like and leave your comments and suggestions in the comment box.

Thank you and have a good day. Bye

