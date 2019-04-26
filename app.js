const Hapi = require('hapi')
const Mongoose = require('mongoose')
const Wreck = require('wreck');
//https://explorer.mchain.network/api/blocks?limit=5

const server = new Hapi.Server({
    "host": "localhost",
    "port": 3000
})

Mongoose.connect('mongodb://localhost/mchain', { useNewUrlParser: true })

const BlockModel = Mongoose.model('block', {
    height: Number,
    size: Number,
    time: Number
})

server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
        await BlockModel.deleteMany({})
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
        let myJson = JSON.parse(payload.toString()).blocks
        console.log(myJson)
        for (let i = 0; i<myJson.length; i++) {
            var block = new BlockModel({  height: myJson[i].height, size: myJson[i].size, time: myJson[i].time });
            block.save();

            delete myJson[i].hash;
            delete myJson[i].txlength;
            delete myJson[i].poolInfo;
            delete myJson[i].isMainChain;
            delete myJson[i].minedBy;
            
        }

        return myJson;
    }
})



server.start();