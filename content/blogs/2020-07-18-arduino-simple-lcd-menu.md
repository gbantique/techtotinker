---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-07-18T15:01:00+08:00'
tags:
  - 16×2 LCD
  - arduino lcd
  - LCD menu
series:
  - My Arduino Exploration
title: Arduino Simple LCD Menu
url: /2020/07/18/arduino-simple-lcd-menu/
---

## **Introduction**

In this article, I will show you a simple LCD Menu implementation I am working on.

In here, we use an Arduino Uno board, a 16×2 LCD for the display, and some tactile buttons for controlling the menu.

The menu is implemented using state machines for the menu navigation. A button debouncing is implemented to prevent unknown button actions.

So here it, feel free to modify it to your liking.

## **Circuit Diagram**

![](/images/Arduino-Simple-Menu.png)

## **Video Demonstration**

{{< youtube -IOssX11wWg >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" title="Simple 16x2 LCD Menu Implementation" }
/*
 *  Simple 16x2 LCD Menu Implementation 
 *    - this uses a finite state machine
 *    - a button debouncing is also implemented to prevent unknown button action
 *  Please feel free to modify this to your liking, but please leave this comment as credit  
 *  
 *  Author: George Bantique
 *          @TechToTinker
 *          July 18, 2020 *   
 */

#include "LiquidCrystal.h"

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

#define button_B    A0
#define button_D    A1
#define button_U    A2
#define button_E    A3

#define ONBOARD_LED 13

#define DEFAULT_DELAY 300

char buttonPressed = '0';

byte menuLevel = 0;     // Level 0: no menu display, display anything you like
                        // Level 1: display main menu
                        // Level 2: display sub menu

byte menu = 1;
byte sub = 1;

unsigned long relay_val_1 = 0;
unsigned long relay_val_2 = 0;
unsigned long relay_val_3 = 0;

bool LED_STATE = false;

bool currState_B = HIGH;
bool currState_D = HIGH;
bool currState_U = HIGH;
bool currState_E = HIGH;
          
bool prevState_B = HIGH; 
bool prevState_D = HIGH; 
bool prevState_U = HIGH; 
bool prevState_E = HIGH; 

unsigned long prevTime_B = 0;
unsigned long prevTime_D = 0;
unsigned long prevTime_U = 0;
unsigned long prevTime_E = 0;

unsigned long waitTime_B = 50;
unsigned long waitTime_D = 50;
unsigned long waitTime_U = 50;
unsigned long waitTime_E = 50;


void setup() {
  lcd.begin(16,2);

  Serial.begin(9600);

  pinMode(button_B, INPUT_PULLUP);
  pinMode(button_D, INPUT_PULLUP);
  pinMode(button_U, INPUT_PULLUP);
  pinMode(button_E, INPUT_PULLUP);

  pinMode(A4,INPUT);

  pinMode(ONBOARD_LED, OUTPUT);
  digitalWrite(ONBOARD_LED, LED_STATE);
  
  showHomeScreen();
}

void loop() {

  checkButton();

  // You can do other things here below
}

void checkButton() {
  // Button Debouncing
  bool currRead_B = digitalRead(button_B);
  bool currRead_D = digitalRead(button_D);
  bool currRead_U = digitalRead(button_U);
  bool currRead_E = digitalRead(button_E);
  if (currRead_B != prevState_B) {
    prevTime_B = millis();
  }
  if (currRead_D != prevState_D) {
    prevTime_D = millis();
  }
  if (currRead_U != prevState_U) {
    prevTime_U = millis();
  }
  if (currRead_E != prevState_E) {
    prevTime_E = millis();
  }
  if ((millis() - prevTime_B) > waitTime_B) {
    if (currRead_B != currState_B) {
      currState_B = currRead_B;
      if (currState_B == LOW) {
        buttonPressed = 'B';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_D) > waitTime_D) {
    if (currRead_D != currState_D) {
      currState_D = currRead_D;
      if (currState_D == LOW) {
        buttonPressed = 'D';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_U) > waitTime_U) {
    if (currRead_U != currState_U) {
      currState_U = currRead_U;
      if (currState_U == LOW) {
        buttonPressed = 'U';
      } else {
        //buttonPressed = '0';
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

  prevState_B = currRead_B;
  prevState_D = currRead_D;
  prevState_U = currRead_U;
  prevState_E = currRead_E;

  processButton(buttonPressed);
}

void processButton(char buttonPressed) {
  switch(menuLevel) {
    case 0: // Level 0
      switch ( buttonPressed ) {
        case 'E': // Enter
          menuLevel = 1;
          menu = 1;
          updateMenu();
          delay(DEFAULT_DELAY);
          break;
        case 'U': // Up
          break;
        case 'D': // Down
          break;
        case 'B': // Back
          break;
        default:
          break;
      }
      break;
    case 1: // Level 1, main menu
      switch ( buttonPressed ) {
        case 'E': // Enter
          updateSub();
          menuLevel = 2;  // go to sub menu
          updateSub();
          delay(DEFAULT_DELAY);
          break;
        case 'U': // Up
          menu++;
          updateMenu();
          delay(DEFAULT_DELAY);
          break;
        case 'D': // Down
          menu--;
          updateMenu();
          delay(DEFAULT_DELAY);
          break;
        case 'B': // Back
          menuLevel = 0;  // hide menu, go back to level 0
          showHomeScreen();
          delay(DEFAULT_DELAY);
          break;
        default:
          break;
      } 
      break;
    case 2: // Level 2, sub menu
      switch ( buttonPressed ) {
        case 'E': 
          menuLevel = 1;
          updateMenu();
          delay(DEFAULT_DELAY);
          break;
        case 'U': // U
          if (menu == 1) {
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
          updateSub();
          delay(DEFAULT_DELAY);
          break;
        case 'D': // D
          if (menu == 1) {
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
          updateSub();
          delay(DEFAULT_DELAY);
          break;
        case 'B': // L
          menuLevel = 1;  // go back to main menu
          updateMenu();
          delay(DEFAULT_DELAY);
          break;
        default:  
          break;
      } 
      break;
    case 3: // Level 3, sub menu of sub menu
    
      break;
    default:
      break;
  }
}

void updateMenu() {
  switch (menu) {
    case 0:
      menu = 1;
      break;
    case 1:
      lcd.clear();
      lcd.print(">Relay 1: ");
      lcd.print(relay_val_1);
      lcd.setCursor(0, 1);
      lcd.print(" Relay 2 ");
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay 1 ");
      lcd.setCursor(0, 1);
      lcd.print(">Relay 2: ");
      lcd.print(relay_val_2);
      break;
    case 3:
      lcd.clear();
      lcd.print(">Relay 3: ");
      lcd.print(relay_val_3);
      lcd.setCursor(0, 1);
      lcd.print("             ");
      break;
    case 4:
      menu = 3;
      break;
  }
}

void updateSub() {
  switch (menu) {
    case 0:
      break;
    case 1:
      lcd.clear();
      lcd.print(" Relay 1:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 1 = ");
      lcd.print(relay_val_1);
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay 2:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 2 = ");
      lcd.print(relay_val_2);
      break;
    case 3:
      lcd.clear();
      lcd.print(" Relay 3:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 3 = ");
      lcd.print(relay_val_3);
      break;
    case 4:
      menu = 3;
      break;
  }
}

void showHomeScreen() {
  lcd.clear();
  lcd.println("  TechToTinker  ");
  lcd.setCursor(0,1);
  lcd.println("  - R for menu  ");
}
```

```cpp { lineNos="true" wrap="true" title="Multiple level 16x2 LCD Menu Implementation" }
/*
/*
 *  Multi-level 16x2 LCD Menu Implementation 
 *    - this is the same as the Simple 16x2 LCD Menu Implementation but with additional levels
 *    - this uses a finite state machine
 *    - a button debouncing is also implemented to prevent unknown button action
 *  Please feel free to modify this to your liking, but please leave this comment as credit  
 *  
 *  Author: George Bantique
 *          @TechToTinker
 *          July 18, 2020 *   
 */

#include "LiquidCrystal.h"

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

#define button_B    A0
#define button_D    A1
#define button_U    A2
#define button_E    A3

#define ONBOARD_LED 13

#define DEFAULT_DELAY 300


char buttonPressed = '0';

byte menuLevel = 0;     // Level 0: no menu display, display anything you like
                        // Level 1: display main menu
                        // Level 2: display sub menu
                        // Level 3: display sub menu of sub menu

byte menu = 1;
byte sub = 1;

unsigned long relay_val_1 = 0;
unsigned long relay_val_2 = 0;
unsigned long relay_val_3 = 0;

bool LED_STATE = false;

bool currState_B = HIGH;
bool currState_D = HIGH;
bool currState_U = HIGH;
bool currState_E = HIGH;
          
bool prevState_B = HIGH; 
bool prevState_D = HIGH; 
bool prevState_U = HIGH; 
bool prevState_E = HIGH; 

unsigned long prevTime_B = 0;
unsigned long prevTime_D = 0;
unsigned long prevTime_U = 0;
unsigned long prevTime_E = 0;

unsigned long waitTime_B = 50;
unsigned long waitTime_D = 50;
unsigned long waitTime_U = 50;
unsigned long waitTime_E = 50;

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


void setup() {
  lcd.begin(16,2);
  lcd.createChar(0, charUp);
  lcd.createChar(1, charDown);
  lcd.createChar(2, charUpDown);
  
  Serial.begin(9600);

  pinMode(button_B, INPUT_PULLUP);
  pinMode(button_D, INPUT_PULLUP);
  pinMode(button_U, INPUT_PULLUP);
  pinMode(button_E, INPUT_PULLUP);

  pinMode(A4,INPUT);

  pinMode(ONBOARD_LED, OUTPUT);
  digitalWrite(ONBOARD_LED, LED_STATE);
  
  updateLevel_0();
}

void loop() {

  checkButton();

  // You can do other things here below

  
}

void checkButton() {

  // Button Debouncing
  bool currRead_B = digitalRead(button_B);
  bool currRead_D = digitalRead(button_D);
  bool currRead_U = digitalRead(button_U);
  bool currRead_E = digitalRead(button_E);

  if (currRead_B != prevState_B) {
    prevTime_B = millis();
  }
  if (currRead_D != prevState_D) {
    prevTime_D = millis();
  }
  if (currRead_U != prevState_U) {
    prevTime_U = millis();
  }
  if (currRead_E != prevState_E) {
    prevTime_E = millis();
  }

  if ((millis() - prevTime_B) > waitTime_B) {
    if (currRead_B != currState_B) {
      currState_B = currRead_B;
      if (currState_B == LOW) {
        buttonPressed = 'B';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_D) > waitTime_D) {
    if (currRead_D != currState_D) {
      currState_D = currRead_D;
      if (currState_D == LOW) {
        buttonPressed = 'D';
      } 
    }
  } else buttonPressed = '0';
  if ((millis() - prevTime_U) > waitTime_U) {
    if (currRead_U != currState_U) {
      currState_U = currRead_U;
      if (currState_U == LOW) {
        buttonPressed = 'U';
      } else {
        //buttonPressed = '0';
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
  prevState_B = currRead_B;
  prevState_D = currRead_D;
  prevState_U = currRead_U;
  prevState_E = currRead_E;
  processButton(buttonPressed);
}

void processButton(char buttonPressed) {
  switch(menuLevel) {
    case 0:                     // Level 0, home screen
      switch ( buttonPressed ) {
        case 'E':               // Enter
          menu = 1;
          menuLevel = 1;        // go to main menu
          updateLevel_1();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'U': // Up
          break;
        case 'D': // Down
          break;
        case 'B': // Back
          menuLevel = 0;        // go to home screen
          updateLevel_0();      // show home screen
          delay(DEFAULT_DELAY);
          break;
        default:
          break;
      }
      break;
    case 1:                     // Level 1, main menu
      switch ( buttonPressed ) {
        case 'E':               // Enter
          sub = 1;
          menuLevel = 2;        // go to sub menu
          updateLevel_2();      // show sub menu
          delay(DEFAULT_DELAY);
          break;
        case 'U':               // Up
          menu++;
          updateLevel_1();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'D':               // Down
          menu--;
          updateLevel_1();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'B': // Back
          menuLevel = 0;        // hide menu, go back to level 0
          updateLevel_0();      // show home screen
          delay(DEFAULT_DELAY);
          break;
        default:
          break;
      } 
      break;
    case 2:                     // Level 2, sub menu
      switch ( buttonPressed ) {
        case 'E':               // Enter
          if (sub == 2) {       // Jump to sub menu of sub menu only when edit is necessary
            menuLevel = 3;        // go to sub menu of sub menu
            updateLevel_3();      // show sub menu of sub menu
          } else if (sub == 3) {
            executeAction();
            delay(1000);
            menuLevel = 2;        // go to sub menu
            updateLevel_2();      // show sub menu
          }
          delay(DEFAULT_DELAY);
          break;
        case 'U':               // Up
          sub++;
          updateLevel_2();
          delay(DEFAULT_DELAY);
          break;
        case 'D':               // Down
          sub--;
          updateLevel_2();      // show main menu
          delay(DEFAULT_DELAY);
          break;
        case 'B':               // Back
          menuLevel = 1;        // go back to level 1
          updateLevel_1();      // show main menu
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
        case 'U':               // Up
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
        case 'D':               // Down
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
        case 'B':               // Back
          menuLevel = 2;        // go back to main menu
          updateLevel_2();      // show main menu
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
  lcd.println("  - R for menu  ");
}

void updateLevel_1 () {
  switch (menu) {
    case 0:
      menu = 1;
      break;
    case 1:
      lcd.clear();
      lcd.print(">Relay 1: ");
      lcd.print(relay_val_1);
      lcd.setCursor(0, 1);
      lcd.print(" Relay 2 ");
      lcd.setCursor(15,1);
      lcd.write((byte)1);     // down arrow
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay 1 ");
      lcd.setCursor(0, 1);
      lcd.print(">Relay 2: ");
      lcd.print(relay_val_2);
      lcd.setCursor(15,1);
      lcd.write((byte)2);     // up and down arrow
      break;
    case 3:
      lcd.clear();
      lcd.print(">Relay 3: ");
      lcd.print(relay_val_3);
      lcd.setCursor(0, 1);
      lcd.print("             ");
      lcd.setCursor(15,1);
      lcd.write((byte)0);     // up arrow
      break;
    case 4:
      menu = 3;
      break;
  }
}

void updateLevel_2 () {
  switch (menu) {
    case 0:
      break;
    case 1:                                 // Relay 1
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay 1:");
          lcd.setCursor(0, 1);
          lcd.print("  Val 1 = ");
          lcd.print(relay_val_1);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay 1:");
          lcd.setCursor(0, 1);
          lcd.print("  Edit Val 1   ");
          lcd.print(relay_val_1);
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay 1:");
          lcd.setCursor(0, 1);
          lcd.print("  Execute Val 1");
          lcd.setCursor(15,1);
          lcd.write((byte)0);     // up arrow
          break;
        default:
          break;
      }
      break;
    case 2:                                 // Relay 2
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay 2:");
          lcd.setCursor(0, 1);
          lcd.print("  Val 2 = ");
          lcd.print(relay_val_2);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay 2:");
          lcd.setCursor(0, 1);
          lcd.print("  Edit Val 2   ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay 2:");
          lcd.setCursor(0, 1);
          lcd.print("  Execute Val 2");
          lcd.setCursor(15,1);
          lcd.write((byte)0);     // up arrow
          break;
        default:
          break;
      }
      break;
    case 3:                               // Relay 3
      switch (sub) {
        case 0:
          break;
        case 1:
          lcd.clear();
          lcd.print(" Relay 3:");
          lcd.setCursor(0, 1);
          lcd.print("  Val 3 = ");
          lcd.print(relay_val_3);
          lcd.setCursor(15,1);
          lcd.write((byte)1);     // down arrow
          break;
        case 2:
          lcd.clear();
          lcd.print(" Relay 3:");
          lcd.setCursor(0, 1);
          lcd.print("  Edit Val 3   ");
          lcd.setCursor(15,1);
          lcd.write((byte)2);     // up and down arrow
          break;
        case 3:
          lcd.clear();
          lcd.print(" Relay 3:");
          lcd.setCursor(0, 1);
          lcd.print("  Execute Val 3");
          lcd.setCursor(15,1);
          lcd.write((byte)0);     // up arrow
          break;
        default:
          break;
      }
      break;
    case 4:
      sub = 3;
      break;
  }
}

void updateLevel_3 () {
  switch (menu) {
    case 0:
      break;
    case 1:
      lcd.clear();
      lcd.print(" Relay 1:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 1 = ");
      lcd.print(relay_val_1);
      break;
    case 2:
      lcd.clear();
      lcd.print(" Relay 2:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 2 = ");
      lcd.print(relay_val_2);
      break;
    case 3:
      lcd.clear();
      lcd.print(" Relay 3:");
      lcd.setCursor(0, 1);
      lcd.print("  Val 3 = ");
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
      lcd.print(" Executing # 1");
      break;
    case 2:
      lcd.clear();
      lcd.print(" Executing # 2");
      break;
    case 3:
      lcd.clear();
      lcd.print(" Executing # 3");
      break;
    case 4:
      sub = 3;
      break;
  }
}
```

## **Call To Action**

If you found this tutorial as helpful, please Like and Share this to your friends. Don’t forget to Subscribe. [Click this to Subscribe to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good day.

