This is the code as it looked just before the presentation at Protothon #2 at Google Stockholm

It consists of: 
* webcam input using webrtc (use webkit canary, or other supported browser, see www.webrtc.org for more information)
* color matching position and size-tracking done with canvas-elements in javascript
* socket.io communication down to a nodejs proxy
* nodejs proxy which sends udp OSC data over the wire to vvvv
* vvvv renderer not included, use any osc monitor.


