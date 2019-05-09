const Wreck = require('wreck');
const mBlockModel = require('./models/BlockModel')
const mStatsModel = require('./models/StatsModel')

//Routes
module.exports = [
    {
        method: "GET",
        path: "/api/updateblockinfo",
        handler: async (request, h) => {
            await mBlockModel.BlockModel.deleteMany({})
            const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
            let myJson = JSON.parse(payload.toString()).blocks

            for (let i = 0; i < myJson.length; i++) {
                var block = new BlockModel({ hash: myJson[i].hash, height: myJson[i].height, size: myJson[i].size, time: myJson[i].time });
                await block.save();
            }

            return mBlockModel.BlockModel.find({});
        }
    },

    //gets block info from the database
    {
        method: "GET",
        path: "/api/blockinfo",
        handler: async (request, h) => {
            return mBlockModel.BlockModel.find({});
        }
    },



    //gets total stats
    {
        method: "GET",
        path: "/api/stats",
        handler: async (request, h) => {
            await mStatsModel.StatsModel.deleteMany({});
            const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/statistics/total');
            let myJson = JSON.parse(payload.toString());

            var stats = new mStatsModel.StatsModel({
                mined_currency_amount: myJson.mined_currency_amount,
                number_of_transactions: myJson.number_of_transactions,
                difficulty: myJson.difficulty
            });
            await stats.save();

            return mStatsModel.StatsModel.find({});
        }
    },

    //get block by hash
    {
        method: "GET",
        path: "/api/blockinfo/{hash}",
        handler: async (request, h) => {
            try {
                var block = await mBlockModel.BlockModel.findOne({ hash: request.params.hash }).exec();
                return h.response(block);
            } catch (error) {
                console.log(request.params.hash)
                return h.response(error).code(500);
            }
        }
    },

    //Delete block by block id
    {
        method: "DELETE",
        path: "/api/blockinfo/{hash}",
        handler: async (request, h) => {
            try {
                console.log(request.params.hash.toString())
                var result = await mBlockModel.BlockModel.findOneAndDelete({ hash: request.params.hash.toString() });
                return h.response(result);
            } catch (error) {
                console.log(request.params.hash)
                return h.response(error).code(500);
            }
        }
    },

    //Update block
    {

        method: "POST",
        path: "/api/blockinfo/{hash}",
        handler: async (request, h) => {
            try {
                console.log(request.payload)
                console.log(request.params)
                const { hash } = request.params
                var result = await models.BlockModel.findOneAndUpdate({ hash }, request.payload, { new: true });
                return h.response(result);
            } catch{
                return h.response(error).code(500);
            }
        }
    },

    //add new block
    {
        method: "POST",
        path: "/api/createblock",
        handler: async (request, h) => {
            try {
                var payload = request.payload;
                console.log(request.payload)
                const block = new BlockModel({
                    hash: payload.hash,
                    height: Number(payload.height),
                    size: Number(payload.size),
                    time: Number(payload.time)
                });
                block.save().then(() => console.log('Saved'));

                return { message: 'Added' };
            } catch {
                return h.response(error).code(500);
            }
        }
    }

]