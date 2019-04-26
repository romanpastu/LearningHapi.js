const Hapi = require('hapi')
const Mongoose = require('mongoose')
const Wreck = require('wreck');

const server = new Hapi.Server({
    "host": "localhost",
    "port": 3000
})

Mongoose.connect('mongodb://localhost/mchain', { useNewUrlParser: true })   //indica url de la bd

const BlockModel = Mongoose.model('blocks', {        //modelo blocks de la bd
    height: Number,
    size: Number,
    time: Number
})

const StatsModel = Mongoose.model('stats', {      //modelo stats de la bd
    mined_currency_amount: Number,
    number_of_transactions: Number,
    difficulty: Number

})

server.route({
    method: "GET",
    path: "/api/blockinfo",
    handler: async (request, h) => {
        await BlockModel.deleteMany({})
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
        let myJson = JSON.parse(payload.toString()).blocks

        for (let i = 0; i < myJson.length; i++) {
            var block = new BlockModel({ height: myJson[i].height, size: myJson[i].size, time: myJson[i].time });
            await block.save();
        }

        return  BlockModel.find({});
    }
})

server.route({
    method: "GET",
    path: "/api/stats",
    handler: async (request, h) => {
        await StatsModel.deleteMany({});
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/statistics/total');
        let myJson = JSON.parse(payload.toString());

        var stats = new StatsModel({
            mined_currency_amount: myJson.mined_currency_amount,
            number_of_transactions: myJson.number_of_transactions,
            difficulty: myJson.difficulty
        });
        await stats.save();

        return  StatsModel.find({});
    }
})



server.start();