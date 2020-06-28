const mongoose = require('mongoose')
const Schema = mongoose.Schema

let photoSchema = new mongoose.Schema({
    author: {
        name: String,
        avatar: String
    },
    created_at: { type: Date, required: true, default: Date.now },
    urls: {
        thumb: { type: String },
        full: { type: String },
    },
    title: {
        type: String
    }
})

module.exports = mongoose.model('Photo', photoSchema)
