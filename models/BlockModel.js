const Mongoose = require('mongoose')

const schema = new Mongoose.Schema({
    hash: String,
    height: Number,
    size: Number,
    time: Number
})

const BlockModel = Mongoose.model('blocks', schema)

module.exports = {BlockModel};