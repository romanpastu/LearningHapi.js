const Mongoose = require('mongoose')

const schema = new Mongoose.Schema({
    mined_currency_amount: Number,
    number_of_transactions: Number,
    difficulty: Number
})

const StatsModel = Mongoose.model('stats', schema)

module.exports = {StatsModel};