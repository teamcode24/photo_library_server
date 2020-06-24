const Image = require('../models/image.model')

exports.getImages = async (req,res,next) => {
    await Image.find({}, (err, images)=> {
        if (err) {
            res.json({ success: false, message: err }); // Return error message
        }
        // Check if blogs were found in database
        if (!images) {
            res.status(404).json({ success: false, message: 'No images found.' }); // Return error of no blogs found
        } else {
            res.status(201).json({ success: true, images: images}); // Return success and blogs array
        }
    })
}

exports.getImage = async (req,res) => {
    const id = req.params.id

    // Check if id is present in parameters
    if (!id) {
        return res.json({ success: false, message: 'No image ID was provided.' }); // Return error message
    }
    
    await Image.findById({_id:id}, (err, image)=> {
        if (err) {
            return res.json({ success: false, message: 'Not a valid image id' }); // Return error message
        }

         // Check if blog was found by id
         if (!image) {
            return res.json({ success: false, message: 'Image not found.' }); // Return error message
        }

        res.json({ success: true, image: image }); // Return success
    })
}

exports.getImagesByTopic = async (req,res)=> {
    const topic = req.params.topic
    await Image.find({topics: topic}, (err, images)=> {
        if (err) {
            return res.json({ success: false, message: 'Error topic image' }); // Return error message
        }

         // Check if blog was found by id
         if (!images) {
            return res.json({ success: false, message: 'Images not found.' }); // Return error message
        }

        res.json({ success: true, images: images }); // Return success
    })
}

exports.getImageBySearch = async (req,res) => {
    if (req.params.search!=undefined && req.params.search!='') {
        var search = req.params.search;

        await Image.find({'title': { '$regex' :search, '$options' : 'i' }}, (err, images)=> {
            if (err) {
                return res.json({ success: false, message: 'Error topic image' }); // Return error message
            }
    
             // Check if blog was found by id
             if (!images) {
                return res.json({ success: false, message: 'Images not found.' }); // Return error message
            }
    
            res.json({ success: true, images: images }); // Return success
        })
    }
}

exports.getImagesPerPage = async (req,res) => {
    var perPage = 9
    var page = req.params.page || 1
    console.log('123', page)
    await Image
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async function(err, images) {
        await Image.estimatedDocumentCount().exec(function(err, count) {
            if (err) return res.json({ success: false, message: 'Images not found.' }); // Return error message
            res.status(200).json({
                images: images,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
}
