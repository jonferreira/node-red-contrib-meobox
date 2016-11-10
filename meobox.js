/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    "use strict";
    var TelnetClient = require('./telnet');
    var tc = new TelnetClient();

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    function MeoBox(n) {

        RED.nodes.createNode(this, n);

        this.host = n.host;
        this.port = n.port;
        this.key = n.key;
        var node = this;

        this.on("input", function (msg) {

            var host = msg.host || node.host;
            var port = msg.port || node.port;
            var key = msg.payload || node.key;
            
            msg.result = "OK";

            if (msg.hasOwnProperty('payload')) {
                msg._payload = msg.payload;
            }
            if (msg.hasOwnProperty('topic')) {
                msg._topic = msg.topic;
            }

            //msg.payload = payload;
            msg.topic = host;

            if (!host) {
                node.warn('No host is specificed. Either specify in node configuration or by passing in msg.host');
                this.status({ fill: "red", shape: "dot", text: "invalid host" });
                return;
            }

            if (!port) {
                node.warn('No port is specificed. Either specify in node configuration or by passing in msg.port');
                this.status({ fill: "red", shape: "dot", text: "invalid port" });
                return;
            }

            if (!key) {
                node.warn('No key is specificed. Either specify in node configuration or by passing in msg.key');
                this.status({ fill: "red", shape: "dot", text: "invalid key" });
                return;
            }

            //this.status({ fill: "green", shape: "ring", text: "connecting" });

            var keys = {
                "back": 8,

                "ok": 13,

                "p+": 33,
                "p-": 34,

                "menu": 36,

                "up": 38,
                "down": 40,
                "left": 37,
                "right": 39,

                "0": 48,
                "1": 49,
                "2": 50,
                "3": 51,
                "4": 52,
                "5": 53,
                "6": 54,
                "7": 55,
                "8": 56,
                "9": 57,

                "options": 111,
                "guiatv": 112,
                "videoclube": 114,
                "gravacoes": 115,
                "teletext": 116,

                "prev": 117,
                "rewind": 118,

                "play/pause": 119,

                "forward": 121,
                "next": 122,

                "stop": 123,

                "red": 140,
                "green": 141,
                "yellow": 142,
                "blue": 143,

                "switchscreen": 156,

                "i": 159,

                "mute": 173,
                "v-": 174,
                "v+": 175,

                "record": 225,

                "power": 233
            };

            var conf = {
                "host": host,
                "port": port,
                "username": '',
                "password": '',
                "enpassword": ''
            };

            var read = function () {
                return tc.read();
            };

            var sendNum = function (key) {
                tc.write('key=' + key + '\n');
            };

            var sendKey = function (l) {
                var key = keys[l];
                if (key === undefined) {
                    return console.log('NOT MAPPED: "' + l + '"!');
                }
                sendNum(key);
            };

            var close = function () {
                tc.write('quit=\n');
                tc.close();
            };

            //var publicAPI = {
            //    read: read,
            //    sendKey: sendKey,
            //    sendNum: sendNum,
            //    close: close
            //};

            this.status({ fill: "green", shape: "dot", text: "connected" });

            //console.log("********************** selected key " + key);

            tc.connect(conf, function (err) {
                if (err) {
                    this.status({ fill: "red", shape: "dot", text: "disconnected" });
                    this.error(err);
                    msg.result = err;
                    node.send(msg);
                    return;
                }
                tc.write('hello\n');
                //if is number > 10
                if (!isNaN(parseFloat(key)) && isFinite(key) && key > 10) {
                    for (var i = 0, len = key.length; i < len; i++) {
                        sendKey(key[i]);
                        //setTimeout(function () {
                        //    sendKey(key[i]);
                        //console.log("********************** " + key[i]);
                        wait(750);
                        //}, 500); //wait half a second
                    }
                //array explode with ;
                } else if (key.search(";") !== -1) {
                    var keys = key.split(";");
                    for (i = 0; i < keys.length; i++) {
                        sendKey(keys[i]);
                        //setTimeout(function () {
                        //    sendKey(keys[i]);
                            //console.log("********************** " + keys[i]);
                        //}, 500); //wait half a second
                    }
                } else {
                    sendKey(key);
                    //console.log("********************** " + key);
                }
                close();
                msg.result = "OK";
                node.send(msg);
            });

        });

        //this.on('close', function () {
        //    // tidy up any state
        //});
    }
    RED.nodes.registerType("meobox", MeoBox);
}
