---
author: George Bantique
categories:
  - Arduino
  - Nano
  - Uno
date: '2020-03-08T07:23:00+08:00'
tags:
  - 16×2 LCD
  - Arduino
  - Arduino Nano
  - DF Player Mini
  - I2C
  - IOT
  - LCD
  - Mp3 player
  - music
  - songs
  - tinkering
series:
  - My Arduino Exploration
title: 'Part 3: DF Player Mini Tinkering with Arduino Nano and LCD'
url: /2020/03/08/part-3-df-player-mini-tinkering-with-arduino-nano-and-lcd/
---

## **Introduction**

To explore more with the functionalities of DF Player Mini, an LCD display is good added feature for this project. To save pin connection, we will use an I2C LCD. Since this is Part 3 of the series in tinkering with DF Player Mini, you may visit:

## **Bill Of Materials**

1. DF Player mini board
2. Arduino Nano
3. I2C 16×2 LCD
4. Micro SD card with mp3 files inside
5. Some tactile switch
6. LED
7. Resistor
8. Power supply of 3.3V to 5.0V
9. A speaker
10. Breadboard (or a perfboard)
11. Some jumper wires

## **Hardware Instruction**

1. Insert the micro SD card to the DF player mini.
2. Place the DF player mini to the breadboard.
3. Connect power supply +5V to VCC pin (pin 1, please refer to below picture)
4. Connect power supply ground to GND pin (pin 7 and pin 10).
5. Connect the speaker – pin to SPK_1 (pin 6) and speaker + pin to SPK_2 pins (pin 8).
6. Connect 1K Ohm resistor in between Arduino Nano Tx pin (pin 11) and DFP Rx pin (pin 2). This is very important since DF Player Mini is 3.3V compliant while our Arduino Nano is 5.0V compliant.
7. Connect the Arduino Nano Rx pin (pin 10) to DF Player Mini Tx pin (pin 3).
8. Connect 1K Ohm resistor and an LED in busy pin (pin 16). BUSY pin works as follows:
    Logic HIGH: not busy
    Logic LOW : busy, something is playing
9. All other pins of DF Player is not used (pin 4, 5, 9, 11, 12, 13, 14, and 15).
10. Connect SDA of I2C LCD to A4 of Arduino Nano.
11. Connect SCL of I2C LCD to A5 of Arduino Nano.
12. Now that our setup is ready, connect the Arduino Nano to the computer with Arduino IDE installed.  
13. Make sure that the port selected is correct.  
14. Select “Arduino Nano” under Tools &gt; Board.  
15. Select “ATMega328P (Old Bootloader)” under Tools &gt; Processor when you are using a clone copy of Arduino Nano.  
16. Upload the sketch (please refer to the source code provided below).  
17. Enjoy. If you find this lesson useful, consider supporting my blogs:  


## **Schematic Diagram**

![](/images/DFPlayerMini-part3-schematic.png)


## **Video demonstration**
j
{{< youtube iumpXYCnbeU >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
///              MP3 PLAYER PROJECT
/// https://educ8s.tv/arduino-mp3-player/
//////////////////////////////////////////


#include "SoftwareSerial.h"
#include "Wire.h"
#include "LiquidCrystal_I2C.h"


uint8_t bPLAY[8] = {0x00, 0x00, 0x08, 0x0C, 0x0E, 0x0C, 0x08, 0x00};
uint8_t bPAUSE[8] = {0x00, 0x00, 0x1B, 0x1B, 0x1B, 0x1B, 0x1B, 0x00};
uint8_t bNEXT[8] = {0x00, 0x00, 0x11, 0x19, 0x1D, 0x19, 0x11, 0x00};
uint8_t bPREVIOUS[8] = {0x00, 0x00, 0x11, 0x13, 0x17, 0x13, 0x11, 0x00};
uint8_t bUPVOLUME[8] = {0x00, 0x00, 0x04, 0x04, 0x0E, 0x04, 0x04, 0x00};
uint8_t bDOWNVOLUME[8] = {0x00, 0x00, 0x00, 0x00, 0x0E, 0x00, 0x00, 0x00};

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);


SoftwareSerial dfpSerial(10, 11);

/*************************
DF Player Serial Format：
  1. START_BYTE     0x7E
  2. VERSION        0xFF
  3. LENGTH         0x06
  4. COMMAND        CMD / operation
  5. FEEDBACK       1: with Feedback, 0: no feedback
  6. PARAMETER_1    Parameter of Command (High data byte)
  7. PARAMETER_2    Parameter of Command (Low data byte)
  8. CHECKSUM   
  9. CHECKSUM  
  10. END_BYTE      0xEF

*/
# define START_BYTE 0x7E
# define VERSION    0xFF
# define LENGTH     0x06
# define FEEDBACK   0x00
# define END_BYTE   0xEF


# define ACTIVATED LOW

const byte buttonPin = A3;

int buttonNext = A2;
int buttonPause = A1;
int buttonPrevious = A0;
boolean isPlaying = false;

unsigned long buttonTimerL = 0;
unsigned long longPressTimeL = 250;
boolean buttonActiveL = false;
boolean longPressActiveL = false;

unsigned long buttonTimerR = 0;
unsigned long longPressTimeR = 250;
boolean buttonActiveR = false;
boolean longPressActiveR = false;

byte currVolume = 25;


void setup () {
  pinMode(buttonPause, INPUT_PULLUP);
  pinMode(buttonNext, INPUT_PULLUP);
  pinMode(buttonPrevious, INPUT_PULLUP);
  pinMode(buttonPin, INPUT_PULLUP);

  Serial.begin(9600);

  dfpSerial.begin (9600);
  delay(1000);
  //playFirst();
  isPlaying = false;

  setVolume(currVolume);
  delay(500);


  lcd.begin();
  lcd.backlight();

  lcd.createChar(0, bPLAY);
  lcd.createChar(1, bPAUSE);
  lcd.createChar(2, bNEXT);
  lcd.createChar(3, bPREVIOUS);
  lcd.createChar(4, bUPVOLUME);
  lcd.createChar(5, bDOWNVOLUME);

  lcd.home();
  lcd.print(" tech-to-tinker");
  
  lcd.setCursor(0, 1);
  lcd.print("MP3 PLAYER");

  Serial.println("Setup Completed.");
}

// display all keycodes
void displayKeyCodes(void) {
  uint8_t i = 0;

 // while (1) {
    lcd.clear();
    lcd.print("Codes 0x");
    lcd.print(i, HEX);
    lcd.print("-0x");
    lcd.print(i + 16, HEX);
    lcd.setCursor(0, 1);

    for (int j = 0; j < 16; j++) {
      lcd.write(i + j);
    }
    i += 16;

    delay(4000);
 // }
}

void loop () { 
  // Button PREVIOUS / Volume DOWN
  if (digitalRead(buttonPrevious) == LOW) {
    if (buttonActiveL == false) {
      buttonActiveL = true;
      buttonTimerL = millis();
    }
    //if ((millis() - buttonTimerL > longPressTimeL) && (longPressActiveL == false)) {
    if (millis() - buttonTimerL > longPressTimeL) { // multiple long press
      longPressActiveL = true;
      volumeDown();
      Serial.println("Volume DOWN: ");
      Serial.println(currVolume);
    }
  } 
  else {
    if (buttonActiveL == true) {
      if (longPressActiveL == true) {
        longPressActiveL = false;
      } else {
        playPrevious();
        Serial.println("Playing PREVIOUS song");
      }
      buttonActiveL = false;
    }
  }

  // Button PLAY / PAUSE
  if (digitalRead(buttonPause) == ACTIVATED)
  {
    Serial.println("Button PLAY");
    if(isPlaying)
    {
      pause();
      isPlaying = false;
      Serial.println("Pause");
    }else
    {
      isPlaying = true;
      play();
      Serial.println("Play");
    }
  }

  // Button NEXT / Volume UP
  if (digitalRead(buttonNext) == LOW) {
    if (buttonActiveR == false) {
      buttonActiveR = true;
      buttonTimerR = millis();
    }

    //if ((millis() - buttonTimerR > longPressTimeR) && (longPressActiveR == false)) {
    if (millis() - buttonTimerR > longPressTimeR) { // Try multiple long press
      longPressActiveR = true;
      volumeUp();
      Serial.println("Volume UP: ");
      Serial.println(currVolume);
    }

  } 
  else {
    if (buttonActiveR == true) {
      if (longPressActiveR == true) {
        longPressActiveR = false;
      } else {
        playNext();
        Serial.println("Playing NEXT song");
      }
      buttonActiveR = false;
    }
  }
}


void play() {
  // Playback
  execute_CMD(0x0D,0,1); 
  lcd.setCursor(14, 1);
  lcd.write(0);
  delay(500);
}

void pause() {
  execute_CMD(0x0E,0,0);
  lcd.setCursor(14, 1);
  lcd.write(1);
  delay(500);
}

void playNext() {
  // Next
  execute_CMD(0x01,0,1);
  lcd.setCursor(14, 1);
  lcd.write(2);
  delay(500);
}

void playPrevious() {
  // Previous
  execute_CMD(0x02,0,1);
  lcd.setCursor(14, 1);
  lcd.write(3);
  delay(500);
}

void volumeUp() {
  if (currVolume < 30) {
    currVolume++;
    setVolume(currVolume);
    lcd.setCursor(14, 1);
    lcd.write(4);
    delay(500);
  }
}

void volumeDown() {
  if (currVolume > 0){
    currVolume--;
    setVolume(currVolume);
    lcd.setCursor(14, 1);
    lcd.write(5);
    delay(500);
  }
}

void setVolume(int volume) {
  execute_CMD(0x06, 0, volume); // Set the volume (0x00~0x30)
  delay(2000);
}

void execute_CMD(byte CMD, byte Par1, byte Par2) {
  // Excecute the command and parameters

  // Calculate the checksum (2 bytes)
  word checksum = -(VERSION + LENGTH + CMD + FEEDBACK + Par1 + Par2);

  // Build the command line
  byte Command_line[10] = { START_BYTE, VERSION, LENGTH, CMD, FEEDBACK,
                            Par1, Par2, highByte(checksum), lowByte(checksum), END_BYTE};

  //Send the command line to the module
  for (byte k = 0; k < 10; k++) {
    dfpSerial.write(Command_line[k]);
  }
}

```

## **Call To Action**

That’s all folks. If you have any question or suggestion, please feel free to leave your comment box.
Thank you and have a good day. Happy tinkering!

[1. techtotinker.com](http://techtotinker.com/)  
[2. TechToTinker Youtube Channel. ](https://www.youtube.com/c/techtotinker/)


## **References And Credits**

1. [Part 2: DF Player Mini Tinkering with Arduino Nano](https://tech-to-tinker.blogspot.com/2020/02/part-2-df-player-mini-tinkering-with.html)

2. [Part 1: DF Player Mini – a mini cheap mp3 player](https://tech-to-tinker.blogspot.com/2020/02/part-1-df-player-mini-mini-cheap-mp3.html)

