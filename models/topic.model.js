const mongoose = require('mongoose')

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
    avatar: {
        type: String,
        default: 'https://picsum.photos/100/100'
    },
    backgroundImage: {
        type: String,
        default: 'https://picsum.photos/300/200'
    },
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo",
            default: [String]
        }
    ],
    contributors: {
        type: Number
    }
})

module.exports = mongoose.model('Topic', topicSchema)
