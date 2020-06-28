const mongoose = require('mongoose')

/**
 * topics: nature, people, technology
 */

const topics = ["nature", "people", "technology"]

let topicSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    creator: {
        type: String,
        default: 'Unsplash'
    },
    description: {
        type: String
    },
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo",
            default: []
        }
    ]
})

module.exports = mongoose.model('Topic', topicSchema)
