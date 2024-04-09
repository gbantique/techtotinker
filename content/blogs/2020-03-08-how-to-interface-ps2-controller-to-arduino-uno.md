---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-03-08T20:48:00+08:00'
tags:
  - Arduino uno
  - electronics
  - game controller
  - hobby
  - IOT
  - tinkering
  - wireless ps2
series:
  - My Arduino Exploration
title: How to Interface PS2 Controller to Arduino Uno
url: /2020/03/08/how-to-interface-ps2-controller-to-arduino-uno/
---

## **Introduction**

Have you ever think of what else could you do with your old PS2 Game Controller? What if you can use it to control something other than your PS2? Yes, it is possible with the help of microcontroller. In this blog post, I will walk you through on how to interface the PS2 game controller to an Arduino Uno microcontroller. But before that, let me tell you how I come up to this idea.

I am thinking on controlling my Bipedal Robot project wireless. My options are the following:  
1. Android mobile phone (with Serial bluetooth terminal) and HC-06 bluetooth module but since I do not have personal android mobile phone(I am just borrowing from my son :)), this idea is not possible.  
2. Dual joystick from defective game controller interface to ESP32. I am able to make two ESP32 to talked with each other using BLE but this will cost more.  
3. Wireless PS2 controller, perfect idea! I personally don’t have it, so I tried to purchased from local electronics store. After tinkering with it, it was just a waste of money. After that, I decided to purchased it online.

So without further discussion, we need the following materials for this tinkering.

## **Bill Of Materials**  

![](/images/Wireless%2BPS2%2BController.png)

1. PS2 game controller (preferably wireless but the wired one functions the same).  
2. Arduino Uno microcontroller.  
3. PS2 Arduino library.  
4. A couple of jumper wires.

## **Hardware Instruction**

**So lets build it!**

![](/images/How-to-interface-PS2-to-Arduino.png)

1. Connect the PS2 DAT pin (pin 1) to digital pin D13 of Arduino Uno.  
2. Connect the PS2 CMD pin (pin 2) to digital pin D12 of Arduino Uno.  
3. Connect the PS2 GND pin (pin 4) to GND pin of Arduino Uno.  
4. Connect the PS2 VCC pin (pin 5) to +5V pin of Arduino Uno.  
5. Connect the PS2 C/S pin (pin 6) to digital pin D11 of Arduino Uno.  
6. Connect the PS2 CLK pin (pin 7) to digital pin D10 of Arduino Uno.

Now our setup is ready. We will be using the PS2 Library for Arduino of Bill Porter. I just modified the example sketch for PS2 so suit our needs. Lets upload the sketch and see the result.

## **Video Demonstration**  

{{< youtube aC_moW2T7e4 >}}

## **Source Code**  

```cpp { lineNos="true" wrap="true" }
#include "PS2X_lib.h"  //for v1.6

PS2X ps2x; // create PS2 Controller Class

//right now, the library does NOT support hot pluggable controllers, meaning 
//you must always either restart your Arduino after you conect the controller, 
//or call config_gamepad(pins) again after connecting the controller.
int error = 0; 
byte type = 0;
byte vibrate = 0;

void setup(){
  Serial.begin(115200);
  
  error = ps2x.config_gamepad(10,12,11,13, false, false);   //setup pins and settings:  GamePad(clock, command, attention, data, Pressures?, Rumble?) check for error
  
  if(error == 0){
    Serial.println("Found Controller, configured successful");
    Serial.println("Try out all the buttons, X will vibrate the controller, faster as you press harder;");
    Serial.println("holding L1 or R1 will print out the analog stick values.");
    Serial.println("Go to www.billporter.info for updates and to report bugs.");
  }
   
  else if(error == 1)
    Serial.println("No controller found, check wiring, see readme.txt to enable debug. visit www.billporter.info for troubleshooting tips");
   
  else if(error == 2)
    Serial.println("Controller found but not accepting commands. see readme.txt to enable debug. Visit www.billporter.info for troubleshooting tips");
   
  else if(error == 3)
    Serial.println("Controller refusing to enter Pressures mode, may not support it. ");
   
  type = ps2x.readType(); 
    
  switch(type) {
    case 0:
      Serial.println("Unknown Controller type");
      break;
    case 1:
      Serial.println("DualShock Controller Found");
      break;
    case 2:
      Serial.println("GuitarHero Controller Found");
      break;
    default:
      break;
  }
}

void loop(){
   /* You must Read Gamepad to get new values
   Read GamePad and set vibration values
   ps2x.read_gamepad(small motor on/off, larger motor strenght from 0-255)
   if you don't enable the rumble, use ps2x.read_gamepad(); with no values
   
   you should call this at least once a second
   */
   
    ps2x.read_gamepad(false, vibrate);          //read controller and set large motor to spin at 'vibrate' speed
    
    if(ps2x.Button(PSB_START))                   //will be TRUE as long as button is pressed
      Serial.println("Start is being held");
    if(ps2x.Button(PSB_SELECT))
      Serial.println("Select is being held");
         
    if(ps2x.Button(PSB_PAD_UP)) {         //will be TRUE as long as button is pressed
      Serial.println("UP is being held");
    }
    if(ps2x.Button(PSB_PAD_RIGHT)){
      Serial.println("Right is being held");
    }
    if(ps2x.Button(PSB_PAD_LEFT)){
      Serial.println("LEFT is being held");
    }
    if(ps2x.Button(PSB_PAD_DOWN)){
      Serial.println("DOWN is being held");
    }   
    
    if (ps2x.NewButtonState())               //will be TRUE if any button changes state (on to off, or off to on)
    {
        if(ps2x.Button(PSB_L3))
          Serial.println("L3 pressed");
        if(ps2x.Button(PSB_R3))
          Serial.println("R3 pressed");
        if(ps2x.Button(PSB_L2))
          Serial.println("L2 pressed");
        if(ps2x.Button(PSB_R2))
          Serial.println("R2 pressed");
    }   
         
    if(ps2x.ButtonPressed(PSB_RED))             //will be TRUE if button was JUST pressed
          Serial.println("Circle just pressed");

    if(ps2x.ButtonReleased(PSB_RED))             //will be TRUE if button was JUST released
          Serial.println("Circle just released"); 


    if(ps2x.ButtonPressed(PSB_PINK))             //will be TRUE if button was JUST pressed
          Serial.println("Square just pressed");
                  
    if(ps2x.ButtonReleased(PSB_PINK))             //will be TRUE if button was JUST released
          Serial.println("Square just released");     

    if(ps2x.ButtonPressed(PSB_GREEN))             //will be TRUE if button was JUST pressed
          Serial.println("Triangle just pressed");
                  
    if(ps2x.ButtonReleased(PSB_GREEN))             //will be TRUE if button was JUST released
          Serial.println("Triangle just released");   

    if(ps2x.ButtonPressed(PSB_BLUE))             //will be TRUE if button was JUST pressed
          Serial.println("X just pressed"); 
                  
    if(ps2x.ButtonReleased(PSB_BLUE))             //will be TRUE if button was JUST released
         Serial.println("X just released");   

         
    //if(ps2x.NewButtonState(PSB_BLUE))            //will be TRUE if button was JUST pressed OR released
    //     Serial.println("X just changed");    
    
    if(ps2x.Button(PSB_L1) || ps2x.Button(PSB_R1)) // print stick values if either is TRUE
    {
        Serial.print("Stick Values:");
        Serial.print(ps2x.Analog(PSS_LY), DEC); // LY
        Serial.print(",");
        Serial.print(ps2x.Analog(PSS_LX), DEC); // LX
        Serial.print(",");
        Serial.print(ps2x.Analog(PSS_RY), DEC); // RY
        Serial.print(",");
        Serial.println(ps2x.Analog(PSS_RX), DEC); // RX
    } 
    
 delay(50);
}
```

## **Call To Action**

That’s all everyone. Please kindly leave your comments and suggestions in the comment box.

Thank you. Happy tinkering!

