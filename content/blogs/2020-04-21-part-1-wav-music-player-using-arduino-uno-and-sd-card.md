---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-04-21T05:48:00+08:00'
tags:
  - 16×2 LCD
  - Arduino uno
  - diy
  - electronics
  - sd
  - SPI
  - tinkering
  - tmrpcm
  - wav music player
series:
  - My Arduino Exploration
title: 'Part 1: Wav Music Player Using Arduino Uno and SD Card'
url: /2020/04/21/part-1-wav-music-player-using-arduino-uno-and-sd-card/
---

## **Introduction**

Few days ago, I am thinking if I could create a mini karaoke using an Arduino Uno, LCD for the lyrics display, SD card for the sound files and the lyrics, and some switches for the playback functions. I tried to search through google and youtube for some resources but even the basic functionality of music playing is not available. Lyrics display with Arduino is also a challenge, so I decided to strip the lyrics display functionality for the meantime and focus first with basic music playback. So here it is.

## **Bill Of Materials**

![](/images/IMG_1280.JPG)

1. Arduino Uno for the main board microcontroller.  
2. Keypad and LCD shield  
 * the LCD will be used to display the current wav file being played. It will also be used for displaying symbols of Play, Pause, Play Next, Play Previous, Volume UP, and Volume DOWN.  
 * the button switches functions as basic playback control.  
3. SD card module which will be access by SPI communication protocol.  
4. SD card with converted wav files. It should be  
 * 8 bit resolution  
 * 16, 000 Hz sampling rate  
 * mono audio channels  
 * unsigned 8 bit PCM format

## **Hardware Instruction**

![](/images/WAV-Music-Player-Schematic.png)

1. Connect the LCD/Keypad shield above the Arduino Uno.  
2. the speaker is connected to Arduino Uno digital pin 3 and GND. I am using this speaker box for amplification of the sound. But you may also try to connect it directly to a speaker without an amplifier, sound will be very weak.  
3. the SD card module is connected as follows:  
 * SD card Chip Select or pin 1 is connected to Arduino Uno digital pin 2 by this white wire.  
 * SD card MOSI or pin 2 is connected to Arduino Uno digital pin 11 by this black wire.  
 * SD card GND or pin 3 is connected to Arduino Uno GND pin by this brown wire.  
 * SD card 5V or pin 4 is connected to Arduino Uno 5V pin by this red wire.  
 * SD card SCLK or pin 5 is connected to Arduino Uno digital pin 13 by this orange wire.  
 * SD card MISO or pin 7 is connected to Arduino Uno digital pin 12 by this yellow wire.  
4. The sound files is accessed using the Arduino SD and SPI libraries.  
5. The sound is played to digital pin 3 by Pulse Width Modulation (PWM) using the Arduino TMRPCM library. The default speaker output of TMRPCM is via digital pin 9. But since I am using a Keypad/LCD shield, digital pin 9 is already use as LCD enable pin. To make this work, you need to edit the pcmConfig.h under the TMRPCM library and uncomment by removing the double forward slash before the #define USE\_TIMER2. This will enable digital pin 3 as speaker output.
 * pressing the SELECT button functions as Play or Pause the current music  
 * pressing the LEFT button functions as Play Previous music  
 * pressing the RIGHT button functions as Play Next music  
 * pressing the UP button functions as Volume UP or increase the volume. The TMRPCM library allows a volume upto 7 but a volume of 4 is the maximum this setup could allow, above this is just a noise.  
 * pressing the DOWN button functions as Volume DOWN or decrease the volume.

## **Video Demonstration**

{{< youtube oha6W0bg_nY >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
/*
 * PROJECT: Arduino Mini Karaoke
 *      1. wav files and lyrics is located in SD card
 *      2. Lyrics will be displayed to 16x2 LCD - not yet
 *      3. 
 *      
 * LINKS:
 *  https://github.com/TMRh20/TMRpcm/wiki
 *  https://github.com/TMRh20/TMRpcm/wiki/Advanced-Features
 *  https://github.com/TMRh20/TMRpcm
 *  
 *  https://audio.online-convert.com/convert-to-wav
 */
#include "TMRpcm.h"
#include "SD.h"
#include "SPI.h"
#include "LiquidCrystal.h"

TMRpcm audio;
LiquidCrystal lcd( 8,  9,  4,  5,  6,  7);
File root;

#define SD_CS_PIN     2
#define SPEAKER_PIN   3
#define TMRPCM_VOLUME 4

// ####################################
// PROTOTHREADING DEFINITIONS HERE:
// ####################################
unsigned long checkKeypadTaskTimer = 0;
const unsigned long checkKeypadTaskInterval = 200;

unsigned long playMusicTaskTimer = 0;
const unsigned long playMusicTaskInterval = 100;

unsigned long updateLCDTaskTimer = 0;
const unsigned long updateLCDTaskInterval = 5000;

// ####################################
// GLOBAL VARIABLES HERE:
// ####################################
String wavFiles[8];
byte wavCnt = 0;
byte wavCurrPos = 0;
int leftState, rightState, upState, downState, selectState = LOW;
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 500;    // the debounce time; increase if the output flickers
boolean isPlaying = false;
boolean isPaused = false;
boolean isPlayNOW = false;
boolean isPlayNEXT = false;
boolean isPlayPREVIOUS = false;
boolean isVolumeUP = false;
boolean isVolumeDOWN = false;
boolean isBusy = true;
int currVolume = TMRPCM_VOLUME;
// variables for LCD custom char
byte bPLAY[8] = {0x00, 0x00, 0x08, 0x0C, 0x0E, 0x0C, 0x08, 0x00};
byte bPAUSE[8] = {0x00, 0x00, 0x1B, 0x1B, 0x1B, 0x1B, 0x1B, 0x00};
byte bNEXT[8] = {0x00, 0x00, 0x11, 0x19, 0x1D, 0x19, 0x11, 0x00};
byte bPREVIOUS[8] = {0x00, 0x00, 0x11, 0x13, 0x17, 0x13, 0x11, 0x00};
byte bUPVOLUME[8] = {0x02, 0x07, 0x02, 0x11, 0x11, 0x1B, 0x0E, 0x04};
byte bDOWNVOLUME[8] = {0x00, 0x07, 0x00, 0x11, 0x11, 0x1B, 0x0E, 0x04};

// ####################################
// PROTOTYPES HERE:
// ####################################
void getWAVFiles(File dir, int numTabs);
int cntChar(String str, char chr);
char* strToChar(String str);
String parseString(int idSeparator, char separator, String str);
int get_key(unsigned int input);

// #########################################################
//  Put code here for initializations
// #########################################################
void setup()
{
  // Initialized LCD
  lcd.begin(16, 2);
  lcd.createChar(0, bPLAY);
  lcd.createChar(1, bPAUSE);
  lcd.createChar(2, bNEXT);
  lcd.createChar(3, bPREVIOUS);
  lcd.createChar(4, bUPVOLUME);
  lcd.createChar(5, bDOWNVOLUME);
  lcd.setCursor(0,0);
  lcd.print(" tech-to-tinker ");

  // Initialized TMRPCM
  audio.speakerPin = SPEAKER_PIN;
  if(!SD.begin(SD_CS_PIN))
  {
    //Serial.println("SD fail");
    return;
  }
  audio.setVolume(TMRPCM_VOLUME);   // This is the maximum volume 

  // Get the wav files available
  root = SD.open("/");
  getWAVFiles(root, 0);
  lcd.setCursor(1,1);
  lcd.write((byte)1);
  lcd.setCursor(3,1);
  lcd.print(wavFiles[wavCurrPos]);
}

// #########################################################
//  Put your main code here, to run repeatedly:
// #########################################################
void loop() {
  if(millis() >= checkKeypadTaskTimer + checkKeypadTaskInterval){
    checkKeypadTaskTimer += checkKeypadTaskInterval;
    checkKeypad();
  }

  if(millis() >= playMusicTaskTimer + playMusicTaskInterval){
    playMusicTaskTimer += playMusicTaskInterval;
    playMusic();
  }

  if(millis() >= updateLCDTaskTimer + updateLCDTaskInterval){
    updateLCDTaskTimer += updateLCDTaskInterval;
    updateLCD();
  }
}

void updateLCD() {
  if ( audio.isPlaying() ) {
    if (isPaused) { // currently in paused
      lcd.setCursor(1,1);
      lcd.write((byte)1);
    } else {  // from pause to play
      lcd.setCursor(1,1);
      lcd.write((byte)0);
    }
  }
}

void playMusic() {
  if (isPlayNEXT) {
    audio.disable();  // this is necessary to prevent overrun
    lcd.setCursor(1,1);
    lcd.write((byte)2);
    isPlayNEXT = false;
    isPlaying = false;
    isPlayNOW = true;
    isPaused = false;

    if ( wavCurrPos < (wavCnt-1) ) {
      wavCurrPos = wavCurrPos + 1;       // increase music pointer
    } else {
      wavCurrPos = 0;     // set music pointer to first
    }
  }

  if (isPlayPREVIOUS) {
    audio.disable();  // this is necessary to prevent overrun
    lcd.setCursor(1,1);
    lcd.write((byte)3);
    isPlayPREVIOUS = false;
    isPlaying = false;
    isPlayNOW = true;
    isPaused = false;

    if ( wavCurrPos == 0 ) {
      wavCurrPos = (wavCnt-1);  // set pointer to last array
    } else {
      wavCurrPos = wavCurrPos - 1;           // decrease pointer
    }
  }

  if ( audio.isPlaying() ) {

  } else {
    if (isPlaying) {
      audio.disable();  // this is necessary to prevent overrun
      isPlayNEXT = false;
      isPlaying = false;
      isPlayNOW = true;
      isPaused = false;
  
      if ( wavCurrPos < (wavCnt-1) ) {
        wavCurrPos = wavCurrPos + 1;       // increase music pointer
      } else {
        wavCurrPos = 0;     // set music pointer to first
      }
    }
  }

  if (isPlayNOW) {  // Select button pressed
    isPlayNOW = false;  // disable immediately to prevent playing again 
    if ( audio.isPlaying() ) {
      // pause playing
      audio.pause();  // pauses/unpauses playback
      if (isPaused) { // currently in paused
        isPaused = false;
      } else {  // from pause to play
        isPaused = true;
      } 
    } else {
      // start playing
      audio.play( strToChar( wavFiles[wavCurrPos] ) );    //plays a file 
      lcd.setCursor(3,1);
      lcd.print("             ");
      lcd.setCursor(3,1);
      lcd.print(wavFiles[wavCurrPos]);
      isPlaying = true;
    }
  } 
  
  if ( (isVolumeUP) && (currVolume<4) ) {  
   lcd.setCursor(1,1);  
   lcd.write((byte)4);  
   currVolume++;  
   audio.setVolume(currVolume);  
   isVolumeUP = false;  
  }  
  if ( (isVolumeDOWN) && (currVolume>-1) ) {  
   lcd.setCursor(1,1);  
   lcd.write((byte)5);  
   currVolume--;  
   audio.setVolume(currVolume);  
   isVolumeDOWN = false;  
  }  
}

int adc_key_val[5] ={50, 200, 400, 600, 800 };  // Original, works after actually reading the analog0
int NUM_KEYS = 5;
int adc_key_in;
int key=-1;  

void checkKeypad() {
  adc_key_in = analogRead(0);                 // Read the value from the sensor
  key = get_key(adc_key_in);                  // Convert into key press
  switch(key) {
    case 0: // RIGHT
      isPlayNEXT = true;
      break;
    case 1: // UP
      isVolumeUP = true;
      break;
    case 2: // DOWN
      isVolumeDOWN = true;
      break;
    case 3: // LEFT
      isPlayPREVIOUS = true;
      break;
    case 4: // SELECT
      if (isPlayNOW) {
        isPlayNOW = false;
      } else {
        isPlayNOW = true;
      }
      break;
    default:  // OTHERS
      break;
  }
}

int get_key(unsigned int input) {
    int k;
    for (k = 0; k < NUM_KEYS; k++)    // Start counting
    {
      //if (input == adc_key_val[k])          // Works, but doesn't allow for deviations
      if (input < adc_key_val[k])             // should be more reliable as it looks for a range instead of a fixed value.
      {
            return k;                         // Breaks the for loop
      }
   }
    if (k >= NUM_KEYS)k = -1;                 // No valid key pressed
    return k;                                 // So break the loop and look for another keypress
}

void getWAVFiles(File dir, int numTabs) {
  byte fileCnt = 0;
  while (true) {
    File entry =  dir.openNextFile();
    if (! entry) {
      // no more files
      break;
    }
    //Serial.println(entry.name());
    String ext = parseString(cntChar(entry.name(), '.'), '.', entry.name());
    if (ext == "WAV") 
    {
      wavFiles[wavCnt] = entry.name();
      wavCnt++;
    }
    
    entry.close();
  }

  if (wavCnt > 0) {
    for (byte i = 0; i < wavCnt; i++) {
      Serial.println(wavFiles[i]);
    }
  }   
  Serial.print("wavCnt :");
  Serial.println(wavCnt,HEX);
}

int cntChar(String str, char chr) {
  int n = 0;
  for (int i = 0; i < str.length(); i++)
  {
    if (str[i] == chr) n++;
  }
  return n;
}

char* strToChar(String str) {
  int len = str.length() + 1;
  char* buf = new char[len];
  strcpy(buf, str.c_str());
  return buf;
}

String parseString(int idSeparator, char separator, String str) { // like a split JS
  String output = "";
  int separatorCout = 0;
  for (int i = 0; i < str.length(); i++)
  {
    if ((char)str[i] == separator)
    {
      separatorCout++;
    }
    else
    {
      if (separatorCout == idSeparator)
      {
        output += (char)str[i];
      }
      else if (separatorCout > idSeparator)
      {
        break;
      }
    }
  }
  return output;
}
```

## **Call To Action**

That’s all everyone. I hope you enjoy watching this video. Please consider supporting my channel by SUBSCRIBING. Click the LIKE button and leave your comments and suggestions in the comment box below.

Thank you and have a good day. Happy tinkering.

Up next, I will try to sync the lyrics and display to LCD.  
George signing out, bye.

