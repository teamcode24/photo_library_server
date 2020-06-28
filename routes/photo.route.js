const router = require('express').Router();
const photoController = require('../controllers/photo.controller')
const validateToken = require('../middlewares/validateToken');

/* ==============
    Get All Photo Route
 ============== */
router.get('/',  photoController.getPhotos);


/* ==============
    Get Photo Route
 ============== */
router.get('/:id',  photoController.getPhoto);

router.get('/r/:id',  photoController.getRelatedPhotos);

/* ==============
  Get Categories Photo Route
============== */
router.get('/t/:topic',  photoController.getPhotosByTopic);

/* ==============
Get Photo By Search Route
============== */
router.get('/s/:search',  photoController.getPhotoBySearch);

/* ==============
  Get Photo Per Page Route
============== */
router.get('/p/:page',  photoController.getPhotosPerPage);



router.post('/u', photoController.uploadPhoto);
module.exports = router;