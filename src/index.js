const DB = require('./db/db');
const WS = require('./websocket');
const db = new DB({
  url: 'mongodb://localhost:27017/p2p'
});

const ws = new WS();

ws.on('userInfo', async (userInfo, ws)=>{
  userInfo.laesttime = Date.now();
  userInfo.isLive = true;
  const result = await db.find({uid: userInfo.uid});
  if(result.length === 0) {
    const result = await db.save(userInfo);
    ws.userInfo  = result;
  } else {
    db.update({_id: result[0]._id}, {laesttime: Date.now(), isLive: true});
    ws.userInfo  = result[0];
  }
})

ws.on('userLeave', async (userInfo)=>{
  db.update({_id: userInfo._id}, {laesttime: Date.now(), isLive: false});
})

const fastify = require('fastify')();
// Declare a route
fastify.get('/getAvailableNodes', async function (request, reply) {
  const result = await db.find({url: request.query.url, isLive: true, uid: {'$ne': request.query.uid}});
  reply.header('Access-Control-Allow-Origin', '*');
  reply.send(result);
})

// Run the server!
fastify.listen(9527, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})