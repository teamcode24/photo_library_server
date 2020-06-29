const Photo = require('../models/photo.model')
const Topic = require('../models/topic.model')
const mongoose = require('mongoose');

exports.getPhotos = async (req, res, next) => {
    await Photo.find({}).exec((err, photos) => {
        if (err) {
            res.json({ success: false, message: err }); // Return error message
        }
        // Check if blogs were found in database
        if (!photos) {
            res.status(404).json({ success: false, message: 'No Photos found.' }); // Return error of no blogs found
        } else {
            res.status(201).json({ success: true, photos: photos }); // Return success and blogs array
        }
    })
}

exports.getPhoto = async (req, res) => {
    const id = req.params.id

    // Check if id is present in parameters
    if (!id) {
        return res.json({ success: false, message: 'No Photo ID was provided.' }); // Return error message
    }

    await Photo.findById({ _id: id }, (err, photo) => {
        if (err) {
            return res.json({ success: false, message: 'Not a valid Photo id' }); // Return error message
        }

        // Check if blog was found by id
        if (!photo) {
            return res.json({ success: false, message: 'Photo not found.' }); // Return error message
        }

        res.json({ success: true, Photo: photo }); // Return success
    })
}

exports.getRelatedPhotos = (req, res) => {
    const id = req.params.id
    Topic.findOne({ photos: mongoose.Types.ObjectId(id) }).populate('photos').exec((err, topic) => {
        if (err) {
            return res.json({ message: err })
        }
        let relatedPhotos = topic.photos.filter(function (value) { return value._id != id })
        res.status(200).json({ result: relatedPhotos })
    })
}

exports.getPhotosByTopic = async (req, res) => {
    const topic = req.params.topic
    await Topic.find({ title: topic })
    .populate('photos')
    .select('photos')
    .exec((err, photos) => {
        if (err) {
            return res.json({ success: false, message: 'Error topic Photo' }); // Return error message
        }

        // Check if blog was found by id
        if (!photos) {
            return res.json({ success: false, message: 'Photos not found.' }); // Return error message
        }

        res.json({ success: true, all_photos: photos }); // Return success
    })
}

exports.getPhotoBySearch = async (req, res) => {
    if (req.params.search != undefined && req.params.search != '') {
        var search = req.params.search;

        await Photo.find({ 'title': { '$regex': search, '$options': 'i' } }, (err, Photos) => {
            if (err) {
                return res.json({ success: false, message: 'Error topic Photo' }); // Return error message
            }

            // Check if blog was found by id
            if (!Photos) {
                return res.json({ success: false, message: 'Photos not found.' }); // Return error message
            }

            res.json({ success: true, Photos: Photos }); // Return success
        })
    }
}

exports.getPhotosPerPage = async (req, res) => {
    var perPage = 9
    var page = req.params.page || 1
    console.log('123', page)
    await Photo
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async function (err, Photos) {
            await Photo.estimatedDocumentCount().exec(function (err, count) {
                if (err) return res.json({ success: false, message: 'Photos not found.' }); // Return error message
                res.status(200).json({
                    Photos: Photos,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
}

exports.uploadPhoto = async (req, res) => {
    await Photo.create(req.body.photo, (err, doc) => {
        if (err) {
            return res.status(400).json({ message: err })
        }
        Topic.findOneAndUpdate({ title: req.body.topic },
            { $push: { photos: doc._id } },
            { new: true, useFindAndModify: false }, (err) => {
                if (err) {
                    return res.status(400).json({ message: err })
                }
                res.status(200).json({ success: true, message: 'Saved success' })
            })
    })
}
