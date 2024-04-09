---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-07-22T13:09:00+08:00'
tags:
  - arduino multitasking
  - arduino multithreading
  - arduino protothreading
  - multiple task at the same time
series:
  - My Arduino Exploration
title: Multitasking with Arduino | Relay Timer Controller | using millis
url: /2020/07/22/multitasking-with-arduino-relay-timer-controller-using-millis/
---

## **Introduction**

In this demonstration, I show a Relay Timer Controller. The multitasking is achieve using the power of millis function.

The following task are achieve:  
1. The On state of the relay (simulated through the LED).  
2. Navigating the LCD menu using buttons.

## **Circuit Diagram**

![](/images/Relay%2BTimer%2BController%2B-%2BCircuit%2BDiagram.png)

## **Video Demonstration**

{{< youtube ylLiFOdPCWQ >}}

## **Call To Action**

If you like this article, please give me **thumbs up** and **share** this to your friends.

If you have question, please write it in the **comment** box.

Please do not forget to **Subscribe**:  
[**Click this to Subscribe**](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good day.

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "LiquidCrystal.h"

// LED definitions for easy reference
#define RED_LED   A0
#define YEL_LED   A1
#define BLU_LED   A2
#define LEFT_SW   A3
#define ENTR_SW   A4
#define RGHT_SW   A5

// Variables for the LCD
LiquidCrystal lcd(13, 12, 11, 10, 9, 8);
byte charUp[8] = {
        B00100,
        B01110,
        B11111,
        B00000,
        B00000,
        B00000,
        B00000,
        B00000
};
byte charDown[8] = {
        B00000,
        B00000,
        B00000,
        B00000,
        B00000,
        B11111,
        B01110,
        B00100
};
byte charUpDown[8] = {
        B00100,
        B01110,
        B11111,
        B00000,
        B00000,
        B11111,
        B01110,
        B00100
};

// Variables for the button switch
#define DEFAULT_DELAY 300
char buttonPressed = '0';
byte menu = 1;
byte sub = 1;
byte menuLevel = 0;     // Level 0: no menu display, display anything you like
                        // Level 1: display main menu
                        // Level 2: display sub menu
                        // Level 3: display sub menu of sub menu
unsigned long relay_val_1 = 0;
unsigned long relay_val_2 = 0;
unsigned long relay_val_3 = 0;

// Variables for the button debouncing
bool currState_L = HIGH;
bool currState_E = HIGH;
bool currState_R = HIGH;
bool prevState_L = HIGH; 
bool prevState_E = HIGH; 
bool prevState_R = HIGH; 
unsigned long prevTime_L = 0;
unsigned long prevTime_E = 0;
unsigned long prevTime_R = 0;
unsigned long waitTime_L = 50;
unsigned long waitTime_E = 50;
unsigned long waitTime_R = 50;

// Variables for the LED
bool ledState_RED = LOW;            // this holds the current state of the LED
bool ledState_YEL = LOW;      
bool ledState_BLU = LOW;            
unsigned long prevMillis_RED = 0;   // this holds the start time of millis for computing the elapse time
unsigned long prevMillis_YEL = 0;   
unsigned long prevMillis_BLU = 0;   
unsigned long interval_RED = 3000;  // this holds the interval of each toggle of LED
unsigned long interval_YEL = 5000;  
unsigned long interval_BLU = 7000;  
unsigned long currMillis_ALL = 0;   // this holds the current time captured by the millis() function
                                    // it is use in general for synchronization purpose
unsigned long elapsed_RED = 0;
unsigned long elapsed_YEL = 0;
unsigned long elapsed_BLU = 0;

bool run_RED = false;
bool run_YEL = false;
bool run_BLU = false;

void setup() {
  lcd.begin(16,2);
  lcd.createChar(0, charUp);
  lcd.createChar(1, charDown);
  lcd.createChar(2, charUpDown);
  lcd.println("  TechToTinker  ");
  
  // Set the pin directions for LEDs
  pinMode(RED_LED, OUTPUT);
  pinMode(YEL_LED, OUTPUT);
  pinMode(BLU_LED, OUTPUT);

  pinMode(LEFT_SW, INPUT_PULLUP);
  pinMode(ENTR_SW, INPUT_PULLUP);
  pinMode(RGHT_SW, INPUT_PULLUP);

  updateLevel_0();
}

void loop() {
  // Store the currently time
  // Notice: it use a single current time for synchonization with other function
  currMillis_ALL = millis();
  checkButton();
  // Virtually process all the task
  process_RED();
  process_YEL();
  process_BLU();
}

void checkButton() {
  // Button Debouncing
  bool currRead_L = digitalRead(LEFT_SW);
  bool currRead_E = digitalRead(ENTR_SW);
  bool currRead_R = digitalRead(RGHT_SW);
  if (currRead_L != prevState_L) {
    prevTime_L = millis();
  }
  if (currRead_E != prevState_E) {
    prevTime_E = millis();
  }
  if (currRead_R != prevState_R) {
    prevTime_R = millis();
  }

  if ((millis() - prevTime_L) > waitTime_L) {
    if (currRead_L != currState_L) {
      currState_L = currRead_L;
      if (currState_L == LOW) {
        buttonPressed = 'L';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_E) > waitTime_E) {
    if (currRead_E != currState_E) {
      currState_E = currRead_E;
      if (currState_E == LOW) {
        buttonPressed = 'E';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_R) > waitTime_R) {
    if (currRead_R != currState_R) {
      currState_R = currRead_R;
      if (currState_R == LOW) {
        buttonPressed = 'R';
      } else {
        //buttonPressed = '0';
      }
    }
  } else buttonPressed = '0';

  prevState_L = currRead_L;
  prevState_E = currRead_E;
  prevState_R = currRead_R;
  processButton(buttonPressed);
}

void processButton(char buttonPressed) {
  switch(menuLevel) {
    case 0:                     // Level 0, home screen
      switch ( buttonPressed ) {
        case 'E':   // Enter
          menu = 1;
          menuLevel = 1;        // go to main menu
          updateLevel_1();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'L':   // Left button
          break;
        case 'R':   // Right button
          break;
        default:
          break;
      }
      break;
    case 1:                       // Level 1, main menu
      switch ( buttonPressed ) {
        case 'E':                 // Enter
          if (menu == 4) {        // Hide menu is selected
            menuLevel = 0;        // go to home screen
            updateLevel_0();      // show home screen
          } else {
            sub = 1;
            menuLevel = 2;        // go to sub menu
            updateLevel_2();      // show sub menu
          }
          delay(DEFAULT_DELAY);
          break;
        case 'L':                 // Left
          menu--;
          updateLevel_1();        // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'R':                 // Right
          menu++;
          updateLevel_1();        // show main menu
          delay(DEFAULT_DELAY);
          break;
        default:
          break;
      } 
      break;
    case 2:                     // Level 2, sub menu
      switch ( buttonPressed ) {
        case 'E':               // Enter
          if (sub == 2) {         // Edit
            menuLevel = 3;        // go to sub menu of sub menu
            updateLevel_3();      // show sub menu of sub menu
          } else if (sub == 3) {  // Execute
            executeAction();
            delay(1000);
            menuLevel = 2;        // go to sub menu
            updateLevel_2();      // show sub menu
          } else if (sub == 4) {  // Back
            menuLevel = 1;        // go back to level 1
            updateLevel_1();      // show main menu
          }
          delay(DEFAULT_DELAY);
          break;
        case 'L':               // Left button
          sub--;
          updateLevel_2();
          delay(DEFAULT_DELAY);
          break;
        case 'R':               // Right button
          sub++;
          updateLevel_2();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        default:
          break;
      } 
      break;
    case 3:                     // Level 3, sub menu of sub menu
      switch ( buttonPressed ) {
        case 'E':               // Enter
          menuLevel = 2;        // go back to level 2
          updateLevel_2();      // show sub menu
          delay(DEFAULT_DELAY);
          break;
        case 'L':               // Left
          if (sub == 2) {       // edit value
            if        (menu == 1) {
              if (relay_val_1 == 0) {
                relay_val_1 = 0;
              } else {
                relay_val_1 = relay_val_1 - 1;
              }
            } else if (menu == 2) {
              if (relay_val_2 == 0) {
                relay_val_2 = 0;
              } else {
                relay_val_2 = relay_val_2 - 1;
              }
            } else if (menu == 3) {
              if (relay_val_3 == 0) {
                relay_val_3 = 0;
              } else {
                relay_val_3 = relay_val_3 - 1;
              }
            }
          }
          updateLevel_3();      // show sub menu
          delay(DEFAULT_DELAY);
          break;
        case 'R':               // Right
          if (sub == 2) {       // edit value
            if        (menu == 1) {
              if (relay_val_1 < 3600000) {  // 1 hour max
                relay_val_1 = relay_val_1 + 1;
              } else {
                relay_val_1 = 3600000;
              }
            } else if (menu == 2) {       
              if (relay_val_2 < 3600000) {  // 1 hour max
                relay_val_2 = relay_val_2 + 1;
              } else {
                relay_val_2 = 3600000;
              }
            } else if (menu == 3) {
              if (relay_val_3 < 3600000) {  // 1 hour max  
                relay_val_3 = relay_val_3 + 1;
              } else {
                relay_val_3 = 3600000;
              }
            }
          }
          updateLevel_3();      // show sub menu
          delay(DEFAULT_DELAY);
          break;
        default:  
          break;
      } 
      break;
    default:
      break;
  }
}

void updateLevel_0() {
  lcd.clear();
  lcd.println("  TechToTinker  ");
  lcd.setCursor(0,1);
  lcd.println("  - E for menu  ");
}

void updateLevel_1 () {
  switch (menu) {
    case 0:
      menu = 1;
      break;
    case 1:
      lcd.clear();
      lcd.print(">Relay RED       ");
      lcd.setCursor(0, 1);
      lcd.print(" Relay YEL       ");
      lcd.setCursor(15,1);
      lcd.write((byte)1);     // down arrow
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay RED       ");
      lcd.setCursor(0, 1);
      lcd.print(">Relay YEL       ");
      lcd.setCursor(15,1);
      lcd.write((byte)2);     // up and down arrow
      break;
    case 3:
      lcd.clear();
      lcd.print(">Relay BLU      ");
      lcd.setCursor(0, 1);
      lcd.print(" Hide Menu      ");
      lcd.setCursor(15,1);
      lcd.write((byte)2);     // up and down arrow
      break;
    case 4:
      lcd.clear();
      lcd.print(" Relay BLU      ");
      lcd.setCursor(0, 1);
      lcd.print(">Hide Menu      ");
      lcd.setCursor(15,1);
      lcd.write((byte)0);     // up arrow
      break;
    case 5:
      menu = 4;
      break;
  }
}

void updateLevel_2 () {
  switch (menu) {
    case 0:
      break;
    case 1:                                 // Relay RED
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay RED:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Duration = ");
          lcd.print(relay_val_1);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay RED:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Edit          ");
          lcd.print(relay_val_1);
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay RED:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Execute       ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 4:
          lcd.clear();
          lcd.print(" Relay RED:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Back          ");
          lcd.setCursor(15,1);
          lcd.write((byte)0);      // up arrow
        default:
          break;
      }
      break;
    case 2:                                 // Relay YEL
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay YEL:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Duration = ");
          lcd.print(relay_val_2);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay YEL:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Edit          ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay YEL:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Execute       ");
          lcd.setCursor(15,1);
          lcd.write((byte)0);     // up arrow
          break;
        case 4:
          lcd.clear();
          lcd.print(" Relay YEL:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Back          ");
          lcd.setCursor(15,1);
          lcd.write((byte)0);      // up arrow
        default:
          break;
      }
      break;
    case 3:                               // Relay BLU
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay BLU      ");
          lcd.setCursor(0, 1);
          lcd.print("  Duration = ");
          lcd.print(relay_val_3);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay BLU:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Edit          ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay BLU:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Execute       ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 4:
          lcd.clear();
          lcd.print(" Relay BLU:     ");
          lcd.setCursor(0, 1);
          lcd.print("  Back          ");
          lcd.setCursor(15,1);
          lcd.write((byte)0);      // up arrow
          break;
        default:
          break;
      }
      break;
    case 4:
      //sub = 3;
      break;
  }
}

void updateLevel_3 () {
  switch (menu) {
    case 0:

      break;
    case 1:
      lcd.clear();
      lcd.print(" Relay RED:     ");
      lcd.setCursor(0, 1);
      lcd.print("  Duration = ");
      lcd.print(relay_val_1);
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay YEL:     ");
      lcd.setCursor(0, 1);
      lcd.print("  Duration = ");
      lcd.print(relay_val_2);
      break;
    case 3:
      lcd.clear();
      lcd.print(" Relay BLU:     ");
      lcd.setCursor(0, 1);
      lcd.print("  Duration = ");
      lcd.print(relay_val_3);
      break;
    case 4:
      sub = 3;
      break;
  }
}

void executeAction () {
  switch (menu) {
    case 0:

      break;
    case 1:
      lcd.clear();
      lcd.print(" Executing RED  ");
      run_RED = true;                   // execute the timer
      prevMillis_RED = millis();        // record the start time
      interval_RED = relay_val_1 * 1000;// duration in seconds
      digitalWrite(RED_LED, HIGH);
      break;
    case 2:
      lcd.clear();
      lcd.print(" Executing YEL  ");
      run_YEL = true;
      prevMillis_YEL = millis();        // record the start time
      interval_YEL = relay_val_2 * 1000;// duration in seconds
      digitalWrite(YEL_LED, HIGH);
      break;
    case 3:
      lcd.clear();
      lcd.print(" Executing BLU  ");
      run_BLU = true;
      prevMillis_BLU = millis();        // record the start time
      interval_BLU = relay_val_3 * 1000;// duration in seconds
      digitalWrite(BLU_LED, HIGH);
      break;
    case 4:
      sub = 3;
      break;
  }
}

void process_RED() {
  if (run_RED) {
    if (millis() - prevMillis_RED >= interval_RED) {
      // Elapse time has reached the interval
      // Save the current time as previous time
      //prevMillis_RED = currMillis_ALL;
      run_RED = false;
      digitalWrite(RED_LED, LOW);
    }
  }
}

void process_YEL() {
  if (run_YEL) {
    if (millis() - prevMillis_YEL >= interval_YEL) {
      // Elapse time has reached the interval
      // Save the current time as previous time
      //prevMillis_RED = currMillis_ALL;
      run_YEL = false;
      digitalWrite(YEL_LED, LOW);
    }
  }
}

void process_BLU() {
  if (run_BLU) {
    if (millis() - prevMillis_BLU >= interval_BLU) {
      // Elapse time has reached the interval
      // Save the current time as previous time
      //prevMillis_RED = currMillis_ALL;
      run_BLU = false;
      digitalWrite(BLU_LED, LOW);
    }
  }
}
```

