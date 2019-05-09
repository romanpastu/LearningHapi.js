const Hapi = require('hapi')
const Mongoose = require('mongoose')
const routes = require('./routes')

const server = new Hapi.Server({
    "host": "localhost",
    "port": 3000,
    routes: { cors: true }
    
})

Mongoose.connect('mongodb://localhost/mchain', { useNewUrlParser: true })   //establishes the database connection

server.route(routes);

server.start();