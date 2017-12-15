const fastify = require('fastify')()

// Declare a route
fastify.get('/getAvailableNodes', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen(9527, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})