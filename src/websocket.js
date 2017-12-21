const WebSocket = require('ws');
const events = require('events');

class WS extends events.EventEmitter{
  constructor() {
    super();
    this.wss = new WebSocket.Server({ port: 8576 });
    console.log(`websocket listening on 8576`);
    this.wss.on('connection', (ws, req)=> {
      ws.on('message', (message)=> {
        var msg = JSON.parse(message);
        if(msg.type === 'userInfo') {
          this.saveMediaInfo(msg.userInfo, ws);
        } else {
          this.saveSdp(msg.sdp, ws);
          this.broadcast(this.wss, ws, msg);
        }
      });
    
      ws.on('close', ()=>{
        this.emit('userLeave', ws.userInfo); 
      })

      ws.on('error', (err)=> {
        // this.emit('userLeave', ws.userInfo); 
      })
    });
  }

  saveSdp(sdp, ws) {
    ws.sdp = sdp;
  }

  responseAnswer(sdp, ws) {
    let message = {type: 'answer',sdp: sdp};
    message.type = 'answer';
    ws.send(JSON.stringify(message));
  }

  saveMediaInfo(userInfo, ws) {
    this.emit('userInfo', userInfo, ws); 
  }

  broadcast(wss, ws, message) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message), function (error) {
          if (error) {
            console.log('Send message error (' + desc + '): ', error);
          }
        });
      }
    });
  }
}

module.exports = WS;