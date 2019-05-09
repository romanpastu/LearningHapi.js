const Wreck = require('wreck');
const mBlockModel = require('./models/BlockModel')
const mStatsModel = require('./models/StatsModel')
const functions = require('./functions')

//Routes
module.exports = [
    {
        method: "GET",
        path: "/api/updateblockinfo",
        handler: async (request, h) => {
            return functions.updateBlockInfo();
        }
    },

    //gets block info from the database
    {
        method: "GET",
        path: "/api/blockinfo",
        handler: async (request, h) => {
            return functions.getBlockInfo();
        }
    },



    //gets total stats
    {
        method: "GET",
        path: "/api/stats",
        handler: async (request, h) => {
            return functions.getStats();
        }
    },

    //get block by hash
    {
        method: "GET",
        path: "/api/blockinfo/{hash}",
        handler: async (request, h) => {
            try {
               return functions.getBlockByHash(request,h);
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
                return functions.deleteById(request, h);
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
                return functions.updateBlock(request, h);
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
                return functions.createBlock(request);
            } catch {
                return h.response(error).code(500);
            }
        }
    }

]