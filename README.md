# node-red-contrib-meobox

This node controls a MeoBox (and possibly any other Microsoft Mediaroom based box) over Telnet.
Both Host, Port and Key can either be set on the node itself or via msg.host, msg.port and msg.payload respectively.
msg.payload can contain multiple keys to be sent separate by “;”.
<pre>{“payload”: “v+;p+;v-“}</pre>
Numeric values are interpreted as channels and treated like such
<pre>{“payload”: “123“}</pre>
The above will change to channel 123 by sending key 1, key 2 and key 3 on 750ms intervals.

Kudos to the project [telnetit](https://github.com/sxyizhiren/telnetit) and [meo-controller](https://github.com/JosePedroDias/meo-controller).  
Using a refactored/simplified version of it. 


## installing

    npm install node-red-contrib-meobox

### Mapped keys so far:

0, 1, 2, 3, 4, 5, 6, 7, 8, 9, back, ok, p+, p-, menu, up, down, left, right, options, guia tv, videoclube, gravacoes, teletext, prev, rewind, play/pause, forward, next, stop, red, green, yellow, blue, switchscreen, i, mute, v-, v+, record, power