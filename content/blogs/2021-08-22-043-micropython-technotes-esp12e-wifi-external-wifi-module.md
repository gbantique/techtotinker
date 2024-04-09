---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-08-22T10:59:00+08:00'
excerpt: In this article, I will demonstrate on how you can use an external WiFi module with ESP32 using MicroPython. Though ESP32 possesses a builtin Wifi device, sometimes an external module is necessary if you want to lessen the workload of the microcontroller.
tags:
  - micropython AP
  - MicroPython ESP12E AT commands
  - MicroPython ESP8266 AT commands
  - MicroPython external wifi module
  - MicroPython NodeMCU AT commands
  - micropython STA
series:
  - MicroPython TechNotes
title: '043 - MicroPython TechNotes: ESP12E WiFi | External WiFi module'
url: /2021/08/22/043-micropython-technotes-esp12e-wifi-external-wifi-module/
---

## **Introduction**

![](/images/043-MicroPython-TechNotes-ESP12E-WiFi-module.png)

In this article, I will demonstrate on how you can use an external WiFi module with ESP32 using MicroPython. Though ESP32 possesses a builtin Wifi device, sometimes an external module is necessary if you want to lessen the workload of the microcontroller. This is also applicable to microcontroller that does not have a builtin WiFi such as Raspberry Pi Pico and STM32.

We will use an ESP12E Wifi module or more commonly known as ESP8266 NodeMCU.

**ESP12E can function in the following modes:**
    1. **STA – or station mode**, it needs to connect to a WiFi router. The WiFi router will provide IP address and handle all WiFi messages. If the module is used as a web server, a web client should be connected to the same WiFi router. This mode should be selected if you want to connect to the Internet.
    2. **SAP – or Software Access Point mode**. In this mode, the ESP12E WiFi module provides IP addresses to all connected station devices. It also handles all WiFi transactions / message exchanges. This mode should be selected if you don’t want to use a WiFi router.
    3. **Both STA and SAP – or hybrid station mode and Access Point**. It is complicated to use.

**To use as WiFi STAtion:**
    1. Send **AT+CWMODE=1**
        This will set the ESP12E WiFi module as station.
    2. Send **AT+CWJAP=”wifi\_ssid”,”wifi\_pass”**
        This will configure the ESP12E WiFi module to connect to a WiFi router with the provided SSID and passwod.
    3. Send **AT+CIPMUX=1**
        This will configure the ESP12E WiFi module to allow multiple connections, maximum of 4. A value of 0 allows a single connection.
    4. Send **AT+CIPSERVER=1,80**
        This will configure the ESP12E WiFi module to create a web server on port 80. A value of 0 terminate the web server.
    5. Send **AT+CIFSR**  
        This will return the IP address of the station device. This is the IP address we are going to use in connecting to the web server.

**To use as Wifi Access Point:**
    1. Send **AT+CWMODE=2**
        This will set the ESP12E WiFi module as Access Point device.
    2. Send **AT+CWSAP=”ESP12E”,”12345678″,5,3** 
        This will configure the ESP12E WiFi module as Access Point with ESP12E as SSID and a password of 12345678. “5” is the number of channel to service. and 3 is the Security Type.
        0 = OPEN
        2 = WPA_PSK
        3 = WPA2_PSK
        4 = WPA_WPA2_PSK
    3. Send **AT+CIPMUX=1**
        This will configure the ESP12E WiFi module to allow multiple connections, maximum of 4. A value of 0 allows a single connection.
    4. Send **AT+CIPSERVER=1,80**
        This will configure the ESP12E WiFi module to create a web server on port 80. A value of 0 terminate the web server.
    5. Send **AT+CIFSR**  
        This will return the IP address of the Access Point device. This is the IP address we are going to use in connecting to the web server.

**To response to a client request:**
    1. Send **AT+CIPSEND=id,html\_length**
    2. Wait for a reply with “&gt;” before sending the whole html page.
    3. Send **AT+CIPCLOSE=1** to close TCP connection.

## **Pinout**

It has 4 pins namely:
1. GND – for the ground pin.
2. VCC – for the supply voltage.
3. TX – for the UART serial transmit pin.
4. RX – for the UART serial receive pin.

## **Bill Of Materials**

In order to follow this lesson, you will need:

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont wires.
4. ESP12E Wifi Module

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of Gorillacell ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the WiFi module by following a color coding such as black for the ground, red for the VCC, yellow for the TX, and white for the RX pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers such that black is to black, red is to red, yellow and the following colors to the yellow pin headers. For this lesson, I choose GPIO 25 for the TX pin and GPIO 26 for the RX pin.
4. Next, power the ESP32 shield by connecting an external 5V power supply though the type-C USB port. Make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 development board to the computer by attaching a micro USB cable.

## **Software Instruction**

1. Copy the example source code from the SOURCE CODE section and paste it to Thonny IDE.
2. Please feel free to modify it and adapt it according to your needs.

## **Video Demonstration**

{{< youtube rUx4QAQws-w >}}

## **Call To Action**

If you have any concern regarding this video, please write your question in the comment box.
You might also liked to support my journey on Youtube by subscribing on my channel, TechToTinker. [Click this to Subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)
Thank you and have a good days ahead.
See you,
    – George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, demonstrates how to use ESP12E as WiFi Web Server using MicroPython:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import UART
from time import sleep_ms

class GORILLACELL_WIFI:
    def __init__(self, port=2, baud=115200, tx=26, rx=25):
        self._wifi = UART(port, baudrate=baud, tx=tx, rx=rx)
        
    def sta_init(self, ssid, pwd):
        self.write('AT+CWMODE=1')
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break

        self.write('AT+CWJAP="{}","{}"'.format(ssid,pwd))
        is_to_check_OK = 0
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "WIFI GOT IP" in response:
                is_to_check_OK = 1
            if is_to_check_OK:
                if "OK" in response:
                    break

    def ap_init(self, ssid, pwd):
        self.write('AT+CWMODE=2')
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break

        self.write('AT+CWSAP="{}","{}",5,3'.format(ssid,pwd))
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break
            
    def server(self, cwmode):
        self.cipmux(mode=1)
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break

        self.cipserver(mode=1,port=80)
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break

        self.cifsr()
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if cwmode == 1:
                if "STAIP" in response:
                    break
            elif cwmode == 2:
                if "APIP" in response:
                    break
                
    def display(self,ids,html):
        self.write('AT+CIPSEND={},{}'.format(ids,len(html))) 
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if ">" in response:
                break
            if "ERROR" in response:
                self.write('AT+CIPSEND={},{}'.format(ids,len(html))) 

        self.write(html)
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break

        self.write('AT+CIPCLOSE=1')
        while(1):
            response = str(self.decode())
            if response != "...":
                print(response)
            if "OK" in response:
                break
            
    def parsed(self):
        '''
        PSEUDO CODE:
            * Get each payload line by line, we are only
            * interested in a line with IPD
            * If +IPD is found, parse the important parts of the string
            *    ipd is the +IPD string
            *    ids is the ID of the connected client
            *    req is the remaining part which will be further dissected
            *    cnt is the number of receive characters
            *    get is the remaining part which will be further dissected again
            *    page is the requested html page by the client
        '''
        request = self.decode_line()
        ids = ""
        page = ""
        if request != "...":
            print(request)
        if "+IPD," in request:
            ipd,ids,req = request.split(",")
            print(ipd, ids, req)
            cnt,get = req.split(":")
            print(cnt, get)
            page = get[4:-10]
            print(page)
        return ids, page
        
    def write(self, tx_data):
        self._wifi.write('{}rn'.format(tx_data))
        
    def read(self):
        timeout = 1000
        test_ret = "..."
        while self._wifi.any()==0:
            if timeout == 0:
                return bytes(test_ret, 'utf-8')
            else:
                timeout -= 1
        reply = self._wifi.read()
        return reply

    def readline(self):
        timeout = 1000
        test_ret = "..."
        while self._wifi.any()==0:
            if timeout == 0:
                return bytes(test_ret, 'utf-8')
            else:
                timeout -= 1
        reply = self._wifi.readline()
        return reply
    
    def decode(self):
        reply = self.read()
        return reply.decode()
    
    def decode_line(self):
        reply = self.readline()
        return reply.decode()
    
    def prints(self):
        print(self.decode())
        
    def echo(self, mode='None'):
        if mode==0:
            self.write('ATE0')
        else: #mode==1
            self.write('ATE1')
            
    def cwmode(self, mode='None'):
        if   mode==1: # Station mode
            self.write('AT+CWMODE=1')
        elif mode==2: # AP mode
            self.write('AT+CWMODE=2')
        elif mode==3: # STA and AP mode
            self.write('AT+CWMODE=3')
        else:
            self.write('AT+CWMODE?')
        
    def cifsr(self):
        self.write('AT+CIFSR')
        
    def cipmux(self,mode='None'):
        if mode==1:
            self.write('AT+CIPMUX=1')
        else:
            self.write('AT+CIPMUX?')
      
    def cipserver(self,mode='None',port='None'):
        sleep_ms(50)
        self.write('AT+CIPSERVER={},{}'.format(mode,port))
    
led = Pin(2, Pin.OUT)
wifi = GORILLACELL_WIFI()
wifi.sta_init(ssid="Tenda_6F1750", pwd="geoven021110")
#wifi.ap_init(ssid="ESP12E",pwd="12345678")
wifi.server(1) # Set 1 for STA and 2 for AP

def index_page():
    global led
    if led.value()==1:
        led_state = 'ON'
        print('led is ON')
    elif led.value()==0:
        led_state = 'OFF'
        print('led is OFF')

    html_page = """    
     <html>  
       <head>    
         <meta content="width=device-width, initial-scale=1" name="viewport"></meta>    
       </head>  
       <body>    
         <center><h2>ESP32 Web Server in MicroPython </h2></center>    
         <center>  
           <form>    
             <button name="LED" type="submit" value="1"> LED ON </button>    
             <button name="LED" type="submit" value="0"> LED OFF </button>    
            </form>    
         </center>    
         <center>  
           <p>LED is now <strong>""" + led_state + """</strong>.</p>  
         </center>    
       </body>  
     </html>"""   
    return html_page

def favicon_page():
    html_page = """  
     HTTP/1.1 200 OK  
     Content-Type: 'image/png'  
       
     <html>  
       <head>  
         <link rel='icon' type='image/png' href='/favicon.png'/>  
       </head>  
       <body>  
       </body>  
     </html>  
     """  
    return html_page


while True:
    client, page = wifi.parsed()
    if page == "/ ":
        wifi.display(client,index_page())

    elif page == "/?LED=1 ":
        led.value(1)
        print('LED is ON')
        wifi.display(client,index_page())
        
    elif page == "/?LED=0 ":
        led.value(0)
        print('LED is OFF')
        html = index_page()
        wifi.display(client,index_page())
        
    elif page == "/favicon.ico ":
        #wifi.display(client,favicon_page())
        pass
            
    sleep_ms(500)

```

## **References And Credits**

1. Purchased your Gorillacell ESP32 development kit:
    <https://gorillacell.kr/>

2. ESP12E AT Commands:
    [https://www.espressif.com/sites/default/files/documentation/4a-esp8266\_at\_instruction\_set\_en.pdf](https://www.espressif.com/sites/default/files/documentation/4a-esp8266_at_instruction_set_en.pdf)
    <http://room-15.github.io/blog/2015/03/26/esp8266-at-command-reference/>
    <https://www.electronicshub.org/esp8266-at-commands/>

