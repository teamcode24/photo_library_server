const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * topics: nature, people, technology
 */
const topics = ["nature", "people", "technology"]
let imageSchema = new mongoose.Schema({
    created_at: { type: Date, required: true, default: Date.now },
    urls: {
        thumb: { type: String },
        full: { type: String },
    },
    topics: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    },
    title: {
        type: String
    }
})

module.exports = mongoose.model('Image', imageSchema)
