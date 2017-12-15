var WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8576 });

var saveSdp = function (sdp, ws) {
    ws.sdp = sdp;
}
var responseAnswer = function (sdp, ws) {
  var message = {type: 'answer',sdp: sdp};
  message.type = 'answer';
  ws.send(JSON.stringify(message));
}

var saveMediaInfo = function (mediaInfo, ws) {
  ws.mediaInfo = mediaInfo;
}

var broadcast = function (wss, ws, message) {
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

wss.on('connection', function(ws, req) {
  ws.on('message', function(message) {
    var msg = JSON.parse(message);
    if(msg.type === 'mediaInfo') {
      saveMediaInfo(msg.mediaInfo, ws);
    } else {
      saveSdp(msg.sdp, ws);
      broadcast(wss, ws, msg);
    }
  });

  ws.on('close', function() {

  })
});