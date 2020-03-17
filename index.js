const Websocket = require('ws');
function isJSON(str) { try { JSON.parse(str); } catch (e) { return false; } return true; }
module.exports = {
    client: class {
        constructor() {
            this.send = function (message) {
                ws.send(JSON.stringify({ type: 'message', message: message }));
            }
            this.login = function (username, password) {
                ws.send(JSON.stringify({ type: 'login', username: username, password: password }));
            }
            this.on = function (something, todo) {
                switch (something) {
                    case 'system':
                        ws.on('message', function (msg) { if (isJSON(msg)) { msg = JSON.parse(msg); if (msg.type !== 'message') { todo(msg); } } });
                        break;
                    case 'announcement':
                        ws.on('message', function (msg) { if (!isJSON(msg) && msg !== 'Received ping') todo(msg) });
                        break;
                    case 'message':
                        ws.on('message', function (msg) { if (isJSON(msg)) { msg = JSON.parse(msg); if (msg.type == 'message') { msg.content = msg.message; todo(msg); } } });
                        break;
                    case 'ready':
                        ws.on('open', todo);
                        break;
                    case 'disconnect':
                        ws.on('close', todo);
                        break;
                }
            }
            this.switchToChannel = function (channel, password) {
                ws.send(JSON.stringify({ type: 'channel', channel: channel, password: password }));
            }
            var ws = new Websocket('wss://2bit--ahmetesad.repl.co');
            setInterval(function () {
                ws.send(JSON.stringify({ type: 'ping' }));
            }, 60000);
        }
    }
}
