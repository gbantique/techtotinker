---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-07-07T13:53:00+08:00'
tags:
  - Arduino
series:
  - My Arduino Exploration
title: 'Tutorial: How to use SIM800L DTMF to Control Anything | Arduino'
url: /2020/07/07/tutorial-how-to-use-sim800l-dtmf-to-control-anything-arduino/
---

## **Introduction**

In here we will learn how we can use SIM800L DTMF to control anything from simple turning On or turning Off of LED to big projects like home automation.

DTMF stands for Dual Tone Multi Frequency or more commonly known as Touch Tone. You will most likely to experience the use of DTMF when you call the customer support hotline of big companies which requires you to press a set of different numbers. I am thinking that this is to categories customer concerns and direct you to a specific person who is knowledgeable about your concern.

With DTMF, each key you press on your phones generates 2 tones of specific frequency. The tones is generated in pairs of high and low frequency groups.

| **Key** | **Low Frequency** | **High Frequency** |
|---------|-------------------|--------------------|
|    1    |        697        |         1209       |
|    2    |        697        |         1336       |
|    3    |        697        |         1477       |
|    4    |        770        |         1209       |
|    5    |        770        |         1336       |
|    6    |        770        |         1477       |
|    7    |        852        |         1209       |
|    8    |        852        |         1336       |
|    9    |        852        |         1477       |
|    0    |        941        |         1336       |
|    \*   |        941        |         1209       |
|    #    |        941        |         1477       |

For example when you press #1 key, you are sending a 697 Hz tone and a 1209 Hz tone. This is in order to separate DTMF from human voice.

## **Circuit Diagram**

![](/images/SIM800L-DTMF.png)

## **Video Demonstration**

{{< youtube QueiLXLFVtM >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "SoftwareSerial.h"

# define SIM800L_Tx 7
# define SIM800L_Rx 6
# define RED_LED_PIN 5
# define GRN_LED_PIN 4

SoftwareSerial SIM800L(SIM800L_Tx, SIM800L_Rx);

char dtmf_cmd;
bool call_flag = false;
bool RED_LED_STATE = false;
bool GRN_LED_STATE = false;

void init_gsm();
void update_led();

void setup()
{
  SIM800L.begin(9600);
  Serial.begin(9600);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GRN_LED_PIN, OUTPUT);
  digitalWrite(RED_LED_PIN, RED_LED_STATE);
  digitalWrite(GRN_LED_PIN, GRN_LED_STATE);
  init_gsm();
}

void loop()
{
  String gsm_data;
  int x = -1;
  // Store serial data from SIM800L
  while (SIM800L.available())
  {
    char c = SIM800L.read();
    gsm_data += c;
    delay(10);
  } 

  // Check if DTMF is receive from SIM800L
  if (call_flag)
  {
    // Call is answered and ongoing
    // Wait for DTMF command
    // Then store the dtmf command
    x = gsm_data.indexOf("DTMF");
    if (x > -1)
    {
        dtmf_cmd = gsm_data[x + 6];
        Serial.println(dtmf_cmd);
        update_led();
    }
    
    x = gsm_data.indexOf("NO CARRIER");
    if (x > -1)
    {
      // Terminate ongoing call when call is disconnected
      SIM800L.println("ATH");
      call_flag = false;
    }
  } else {
    // SIM800L is in idle, just waiting for calls
    // answer incoming call when ringing
    // then process it
    x = gsm_data.indexOf("RING");
    if (x > -1)
    {
      delay(5000);
      SIM800L.println("ATA");
      call_flag = true;
    }
  }
}

void init_gsm() {
  boolean gsm_Ready = 1;
  Serial.println("initializing GSM module");
  while (gsm_Ready > 0)
  {
    SIM800L.println("AT");
    Serial.println("AT");
    while (SIM800L.available())
    {
      if (SIM800L.find("OK") > 0)
        gsm_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("AT READY");

  boolean ntw_Ready = 1;
  Serial.println("finding network");
  while (ntw_Ready > 0)
  {
    SIM800L.println("AT+CPIN?");
    Serial.println("AT+CPIN?");
    while (SIM800L.available())
    {
      if (SIM800L.find("+CPIN: READY") > 0)
        ntw_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("NTW READY");

  boolean DTMF_Ready = 1;
  Serial.println("turning DTMF ON");
  while (DTMF_Ready > 0)
  {
    SIM800L.println("AT+DDET=1");
    Serial.println("AT+DDET=1");
    while (SIM800L.available())
    {
      if (SIM800L.find("OK") > 0)
        DTMF_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("DTMF READY");
}

void update_led()
{
  if (dtmf_cmd == '1') {
    if (RED_LED_STATE) {
      RED_LED_STATE = false;
      digitalWrite(RED_LED_PIN, RED_LED_STATE); //relay 1 on
      Serial.println("RELAY 1 OFF");
    } else {
      RED_LED_STATE = true;
      digitalWrite(RED_LED_PIN, RED_LED_STATE); //relay 1 on
      Serial.println("RELAY 1 ON");
    }
  }

  if (dtmf_cmd == '2') {
    if (GRN_LED_STATE) {
      GRN_LED_STATE = false;
      digitalWrite(GRN_LED_PIN, GRN_LED_STATE); //relay 2 on
      Serial.println("RELAY 2 OFF");
    } else {
      GRN_LED_STATE = true;
      digitalWrite(GRN_LED_PIN, GRN_LED_STATE); //relay 2 on
      Serial.println("RELAY 2 ON");
    }
  }
}
```

**This source code is for Ajit Zagade as requested**
[![](/images/AjitSagade.png)](/images/AjitSagade.png)

```cpp { lineNos="true" wrap="true" }
#include "SoftwareSerial.h"

# define SIM800L_Tx 7
# define SIM800L_Rx 6
# define RED_LED_PIN 5
# define GRN_LED_PIN 4

SoftwareSerial SIM800L(SIM800L_Tx, SIM800L_Rx);
String number = "+ZZxxxxxxxxxx";  // Replaced the following:
                                  // ZZ - your country code
                                  // xx - 10-digit mobile number
char dtmf_cmd;
bool call_flag = false;
bool RED_LED_STATE = false;
bool GRN_LED_STATE = false;

void init_gsm();
void update_led();

void setup()
{
  SIM800L.begin(9600);
  Serial.begin(9600);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GRN_LED_PIN, OUTPUT);
  digitalWrite(RED_LED_PIN, RED_LED_STATE);
  digitalWrite(GRN_LED_PIN, GRN_LED_STATE);
  init_gsm();
}

void loop()
{
  String gsm_data;
  int x = -1;
  
  // Store serial data from SIM800L
  while (SIM800L.available())
  {
    char c = SIM800L.read();
    gsm_data += c;
    delay(10);
  } 

  // Check if DTMF is receive from SIM800L
  if (call_flag)
  {
    // Call is answered and ongoing
    // Wait for DTMF command
    // Then store the dtmf command
    x = gsm_data.indexOf("DTMF");
    if (x > -1)
    {
        dtmf_cmd = gsm_data[x + 6];
        Serial.println(dtmf_cmd);
        update_led();
    }
    
    x = gsm_data.indexOf("NO CARRIER");
    if (x > -1)
    {
      // Terminate ongoing call when call is disconnected
      SIM800L.println("ATH");
      call_flag = false;
    }
  } else {
    // SIM800L is in idle, just waiting for calls
    // answer incoming call when ringing
    // then process it
    x = gsm_data.indexOf("RING");
    if (x > -1)
    {
      delay(5000);
      SIM800L.println("ATA");
      call_flag = true;
    }
  }
}

void init_gsm() {
  boolean gsm_Ready = 1;
  Serial.println("initializing GSM module");
  while (gsm_Ready > 0)
  {
    SIM800L.println("AT");
    Serial.println("AT");
    while (SIM800L.available())
    {
      if (SIM800L.find("OK") > 0)
        gsm_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("AT READY");

  boolean ntw_Ready = 1;
  Serial.println("finding network");
  while (ntw_Ready > 0)
  {
    SIM800L.println("AT+CPIN?");
    Serial.println("AT+CPIN?");
    while (SIM800L.available())
    {
      if (SIM800L.find("+CPIN: READY") > 0)
        ntw_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("NTW READY");

  boolean DTMF_Ready = 1;
  Serial.println("turning DTMF ON");
  while (DTMF_Ready > 0)
  {
    SIM800L.println("AT+DDET=1");
    Serial.println("AT+DDET=1");
    while (SIM800L.available())
    {
      if (SIM800L.find("OK") > 0)
        DTMF_Ready = 0;
    }
    delay(2000);
  }
  Serial.println("DTMF READY");
}

void update_led() {
  if (dtmf_cmd == '1') {
    if (RED_LED_STATE) {
      RED_LED_STATE = false;
      digitalWrite(RED_LED_PIN, RED_LED_STATE); //relay 1 on
      Serial.println("RELAY 1 OFF");
      SendSMS("RELAY 1 OFF");
    } else {
      RED_LED_STATE = true;
      digitalWrite(RED_LED_PIN, RED_LED_STATE); //relay 1 on
      Serial.println("RELAY 1 ON");
      SendSMS("RELAY 1 ON");
    }
  }

  if (dtmf_cmd == '2') {
    if (GRN_LED_STATE) {
      GRN_LED_STATE = false;
      digitalWrite(GRN_LED_PIN, GRN_LED_STATE); //relay 2 on
      Serial.println("RELAY 2 OFF");
      SendSMS("RELAY 2 OFF");
    } else {
      GRN_LED_STATE = true;
      digitalWrite(GRN_LED_PIN, GRN_LED_STATE); //relay 2 on
      Serial.println("RELAY 2 ON");
      SendSMS("RELAY 2 ON");
    }
  }
}

void SendSMS(String SMS) {
  //Serial.println ("Sending Message");
  SIM800L.println("AT+CMGF=1");    //Sets the GSM Module in Text Mode
  delay(1000);
  //Serial.println ("Set SMS Number");
  SIM800L.println("AT+CMGS="" + number + ""r"); //Mobile phone number to send message
  delay(1000);
  SIM800L.println(SMS);
  delay(100);
  SIM800L.println((char)26);// ASCII code of CTRL+Z
  delay(1000);
}
```

## **Call To Action**

I hope you and enjoy this article. If you have any question, please do not hesitate to write it in the comment box.
Thank you and have a good day.
Happy tinkering.

