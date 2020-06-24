const mongoose = require('mongoose')

/**
 * topics: nature, people, technology
 */

let imageSchema = new mongoose.Schema({
    created_at: { type: Date, required: true, default: Date.now },
    urls: {
        thumb: { type: String },
        full: { type: String },
    },
    topics: {
        type: String,
    },
    title: {
        type:String
    }
})

let Image = mongoose.model('Image', imageSchema)

module.exports = Image
