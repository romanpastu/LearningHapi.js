const Hapi = require('hapi')
const Mongoose = require('mongoose')
const Wreck = require('wreck');

const server = new Hapi.Server({
    "host": "localhost",
    "port": 3000
})

Mongoose.connect('mongodb://localhost/mchain', { useNewUrlParser: true })   //indica url de la bd
//
const schema = new Mongoose.Schema({
    hash: String,
    height: Number,
    size: Number,
    time: Number
  })

const BlockModel = Mongoose.model('blocks', schema)


//


const StatsModel = Mongoose.model('stats', {      //modelo stats de la bd
    mined_currency_amount: Number,
    number_of_transactions: Number,
    difficulty: Number

})
//gets and updates blockinfo
server.route({
    method: "GET",
    path: "/api/updateblockinfo",
    handler: async (request, h) => {
        await BlockModel.deleteMany({})
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
        let myJson = JSON.parse(payload.toString()).blocks

        for (let i = 0; i < myJson.length; i++) {
            var block = new BlockModel({ hash: myJson[i].hash ,height: myJson[i].height, size: myJson[i].size, time: myJson[i].time });
            await block.save();
        }

        return BlockModel.find({});
    }
})
//gets block info from the database
server.route({
    method: "GET",
    path: "/api/blockinfo",
    handler: async (request, h) => {
        return BlockModel.find({});
    }
})

//gets total stats
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

        return StatsModel.find({});
    }
})

//get block by hash
server.route({
    method: "GET",
    path:"/api/blockinfo/{hash}",
    handler: async (request,h) => {
        try{
            var block = await BlockModel.findOne({hash: request.params.hash}).exec();
            return h.response(block);
        }catch(error){
            console.log(request.params.hash)
            return h.response(error).code(500);
        }   
    }
})

//Delete block by block id
server.route({
    method: "DELETE",
    path: "/api/blockinfo/{hash}",
    handler: async (request,h) => {
        try{
            var result = await BlockModel.findOneAndDelete({hash: request.params.hash.toString()});
            return h.response(result);
        }catch(error){
            console.log(request.params.hash)
            return h.response(error).code(500);
        }
    }
})

//Update block

server.route({
    method: "PUT",
    path:"/api/blockinfo/{hash}",
    handler: async (request, h) => {
         try{
            var result = await BlockModel.findOneAndUpdate(request.params.hash,  JSON.parse(request.payload ),  {new: true});
            return h.response(result);
        }catch{
            return h.response(error).code(500);
        }
    }
})


server.start();