const Wreck = require('wreck');
const mBlockModel = require('./models/BlockModel')
const mStatsModel = require('./models/StatsModel')

module.exports = {
    async updateBlockInfo() {
        await mBlockModel.BlockModel.deleteMany({})
        const { res, payload } = await Wreck.get('https://explorer.mchain.network/api/blocks?limit=50');
        let myJson = JSON.parse(payload.toString()).blocks

        for (let i = 0; i < myJson.length; i++) {
            var block = new mBlockModel.BlockModel({ hash: myJson[i].hash, height: myJson[i].height, size: myJson[i].size, time: myJson[i].time });
            await block.save();
        }

        return mBlockModel.BlockModel.find({});
    },

    async getBlockInfo() {
        return mBlockModel.BlockModel.find({});
    },

    async getStats() {
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
    },

    async deleteById(request, h) {
        var result = await mBlockModel.BlockModel.findOneAndDelete({ hash: request.params.hash.toString() });
        return h.response(result);
    },

    async updateBlock(request, h) {
        const { hash } = request.params
        var result = await mBlockModel.BlockModel.findOneAndUpdate({ hash }, request.payload, { new: true });
        return h.response(result);
    },

    async createBlock(request) {
        var payload = request.payload;
        const block = new mBlockModel.BlockModel({
            hash: payload.hash,
            height: Number(payload.height),
            size: Number(payload.size),
            time: Number(payload.time)
        });
        block.save().then(() => console.log('Saved'));

        return { message: 'Added' };
    }



}