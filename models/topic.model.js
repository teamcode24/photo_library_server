const mongoose = require('mongoose')

/**
 * topics: nature, people, technology
 */

const topics = ["nature", "people", "technology"]

let topicSchema = new mongoose.Schema({
    title: {
        type:String,
        enum: topics
    },
    creator: {
        type: String,
        default: 'Unsplash'
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('Topic', topicSchema)
