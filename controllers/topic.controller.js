const Topic = require('../models/topic.model')

exports.getTopics = async (req,res,next) => {
    await Topic.find({},'title description', (err, topics)=> {
        if (err) {
            return res.status(404).json({ success: false, message: err }); // Return error message
        }
        // Check if blogs were found in database
        if (!topics) {
            res.status(404).json({ success: false, message: 'No topics found.' }); // Return error of no blogs found
        } else {
            res.status(201).json({ success: true, topics: topics}); // Return success and blogs array
        }
    })
}

exports.getTopic = async (req,res) => {
    const topic = req.params.topic
    await Topic.find({title: topic}, 'title description photos', (err,topic)=> {
        if (err) {
            return res.status(404).json({success:false, message: 'No photos found'})
        }
        res.status(200).json({ success: true, topics: topic });
    })
}