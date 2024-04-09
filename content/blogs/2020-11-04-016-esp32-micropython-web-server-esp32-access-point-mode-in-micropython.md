---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-11-04T20:39:00+08:00'
excerpt: In this article you will learn to configure ESP32 wifi as Access Point. You will also learn to create a web server hosted on it.
tags:
  - esp32 micropython
  - ESP8266 MicroPython
  - micropython access point
  - micropython esp32 wifi
  - MicroPython tutorials
  - micropython weather station
  - MicroPython web server
series:
  - ESP32 MicroPython
title: '016 - ESP32 MicroPython: Web Server | ESP32 Access Point'
url: /2020/11/04/016-esp32-micropython-web-server-esp32-access-point-mode-in-micropython/
---

## **Introduction**

![](/images/016-esp32-micropython-wifi-ap-techtotinker.png)

In this article you will learn to configure ESP32 wifi as Access Point. You will also learn to create a web server hosted on it.

## **Bill Of Materials**

1. ESP32 development board.
2. DHT22 (or DHT11 with slight, very small modification in the code).
3. Connecting wires.

## **Hardware Instruction**

1. Connect the DHT22 VCC pin to 3.3V pin of ESP32.
2. Connect the DHT22 Data pin to D23 pin of ESP32.
3. Connect the DHT22 GND pin to GND pin of ESP32.

![](/images/016-esp32-micropython-wifi-ap-techtotinker-diagram.png)

## **Video Demonstration**

{{< youtube LKQvzN_Rk-U >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, Web Server on ESP32 as Wifi Access Point. The web server is use for controlling the GPIO state of the pins.

```py { lineNos="true" wrap="true" }
# ************************
#
import machine
import time
led = machine.Pin(2,machine.Pin.OUT)
led.off()


# ************************
# Configure the ESP32 wifi
# as Access Point mode.
import network
ssid = 'ESP32-AP-WebServer'
password = '123456789'

ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=ssid, password=password)
while not ap.active():
    pass
print('network config:', ap.ifconfig())

# ************************
# Configure the socket connection
# over TCP/IP
import socket

# AF_INET - use Internet Protocol v4 addresses
# SOCK_STREAM means that it is a TCP socket.
# SOCK_DGRAM means that it is a UDP socket.
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80)) # specifies that the socket is reachable by any address the machine happens to have
s.listen(5)     # max of 5 socket connections

# ************************
# Function for creating the
# web page to be displayed
def web_page():
    if led.value()==1:
        led_state = 'ON'
        print('led is ON')
    elif led.value()==0:
        led_state = 'OFF'
        print('led is OFF')
        
   html_page = """   
     <html>   
     <head>   
      <meta name="viewport" content="width=device-width, initial-scale=1">   
     </head>   
     <body>   
       <center><h2>ESP32 Web Server in MicroPython </h2></center>   
       <center>   
        <form>   
         <button type='submit' name="LED" value='1'> LED ON </button>   
         <button type='submit' name="LED" value='0'> LED OFF </button>   
        </form>   
       </center>   
       <center><p>LED is now <strong>""" + led_state + """</strong>.</p></center>   
     </body>   
     </html>"""   
   return html_page  

while True:
    # Socket accept() 
    conn, addr = s.accept()
    print("Got connection from %s" % str(addr))
    
    # Socket receive()
    request=conn.recv(1024)
    print("")
    print("")
    print("Content %s" % str(request))

    # Socket send()
    request = str(request)
    led_on = request.find('/?LED=1')
    led_off = request.find('/?LED=0')
    if led_on == 6:
        print('LED ON')
        print(str(led_on))
        led.value(1)
    elif led_off == 6:
        print('LED OFF')
        print(str(led_off))
        led.value(0)
    response = web_page()
    conn.send('HTTP/1.1 200 OKn')
    conn.send('Content-Type: text/htmln')
    conn.send('Connection: close\n')
    conn.sendall(response)
    
    # Socket close()
    conn.close()
```

### 2. Example # 2, Display DHT sensor readings through a web server:

```py { lineNos="true" wrap="true" }
# ************************
#
import machine
import time
led = machine.Pin(2,machine.Pin.OUT)
led.off()
# ************************
# Configure the ESP32 wifi
# as Access Point mode.
import network
ssid = 'ESP32-AP-WebServer'
password = '123456789'
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=ssid, password=password)
while not ap.active():
    pass
print('network config:', ap.ifconfig())
# ************************
# Configure the socket connection
# over TCP/IP
import socket
# AF_INET - use Internet Protocol v4 addresses
# SOCK_STREAM means that it is a TCP socket.
# SOCK_DGRAM means that it is a UDP socket.
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80)) # specifies that the socket is reachable by any address the machine happens to have
s.listen(5)     # max of 5 socket connections
# DHT sensor initializations
import dht
d = dht.DHT22(machine.Pin(23))
# If you will use DHT11, change it to:
# d = dht.DHT11(machine.Pin(23))
# ************************
# Function for creating the
# web page to be displayed
def web_page():
    # Get the DHT readings
    d.measure()
    t = d.temperature()
    h = d.humidity()
    
   html_page = """   
     <html>   
     <head>   
      <meta name="viewport" content="width=device-width, initial-scale=1">   
      <meta http-equiv="refresh" content="1">   
     </head>   
     <body>   
       <center><h2>ESP32 Web Server in MicroPython </h2></center>   
       <center><p>Temperature is <strong>""" + str(t) + """ C.</strong>.</p></center>   
       <center><p>Humidity is <strong>""" + str(h) + """ %.</strong>.</p></center>   
     </body>   
     </html>"""   
   return html_page   

while True:
    # Socket accept() 
    conn, addr = s.accept()
    print("Got connection from %s" % str(addr))
    
    # Socket receive()
    request=conn.recv(1024)
    print("")
    print("Content %s" % str(request))
    # Socket send()
    request = str(request)
    
    # Create a socket reply
    response = web_page()
    conn.send('HTTP/1.1 200 OKn')
    conn.send('Content-Type: text/htmln')
    conn.send('Connection: close\n')
    conn.sendall(response)
    
    # Socket close()
    conn.close()
```

