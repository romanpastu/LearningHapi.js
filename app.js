const Hapi = require('hapi')
const Mongoose = require('mongoose')
const Wreck = require('wreck');
//https://explorer.mchain.network/api/blocks?limit=5

const server = new Hapi.Server({
    "host": "localhost",
    "port": 3005
})

Mongoose.connect('mongodb://localhost/mchain', { useNewUrlParser: true })

const BlockModel = Mongoose.model('block',{
    height: Number,
    size: Number,
    time: Number
})

server.route({
    method:"GET",
    path:"/",
    handler: async (request,h) => {
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
        let myJson = JSON.parse(payload.toString()).blocks

         for (let i = 0 ; myJson.length;i++){
            var block = new BlockModel({height: myJson[i].height, size : myJson[i].size, time: myJson[i].time});
            block.save();
         }


        return "hola"
    }
})



server.start();