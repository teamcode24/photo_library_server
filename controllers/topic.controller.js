const Topic = require('../models/topic.model')

exports.getTopics = async (req, res, next) => {
    await Topic.find({}, 'title description creator avatar contributors', (err, topics) => {
        if (err) {
            return res.status(404).json({ success: false, message: err }); // Return error message
        }
        // Check if blogs were found in database
        if (!topics) {
            res.status(404).json({ success: false, message: 'No topics found.' }); // Return error of no blogs found
        } else {
            res.status(201).json({ success: true, topics: topics }); // Return success and blogs array
        }
    })
}

exports.getTopic = async (req, res) => {
    const topic = req.params.topic
    await Topic.find({ title: topic }).populate('photos').exec((err, doc) => {
        if (err) {
            return res.status(404).json({ success: false, message: err })
        }
        res.status(200).json({ success: true, topics: doc });
    })
}

exports.createTopic = async (req, res) => {
    await Topic.create(req.body, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err })
        }
        res.status(200).json({ success: true, message: 'Topic created' })
    })
}