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
        switch(msg.type) {
          case 'userInfo':
          this.saveMediaInfo(msg.userInfo, ws);
          break;
          case 'offer':
          this.saveSdp(msg.sdp, ws);
          this.broadcast(this.wss, ws, msg);
          break;
          case 'nodes':
          this.filterNodeMap[ws.userInfo._id] = msg.nodes;
          break;
          default:
          if(msg) {
            this.broadcast(this.wss, ws, msg);
          }
          break;
        }
      });
    
      ws.on('close', ()=>{
        this.emit('userLeave', ws.userInfo); 
      })

      ws.on('error', (err)=> {
        this.emit('userLeave', ws.userInfo); 
      })
    });
    this.filterNodeMap = {
      
    }
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
    wss.clients.forEach((client)=> {
      this.filterNodeMap[ws.userInfo._id].forEach((item)=>{
        if (client.userInfo._id == item._id && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message), function (error) {
            if (error) {
              console.log('Send message error (' + desc + '): ', error);
            }
          });
        }
      })
    });
  }
}

module.exports = WS;