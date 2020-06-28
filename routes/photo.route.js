const router = require('express').Router();
const photoController = require('../controllers/photo.controller')
const validateToken = require('../middlewares/validateToken');
 /* ==============
     Get All Photo Route
  ============== */
  router.get('/',validateToken, photoController.getPhotos);


 /* ==============
     Get Photo Route
  ============== */
  router.get('/:id',validateToken, photoController.getPhoto);

   /* ==============
     Get Categories Photo Route
  ============== */
  router.get('/t/:topic',validateToken, photoController.getPhotosByTopic);
  
     /* ==============
     Get Photo By Search Route
  ============== */
  router.get('/s/:search',validateToken, photoController.getPhotoBySearch);
  
   /* ==============
     Get Photo Per Page Route
  ============== */
  router.get('/p/:page',validateToken, photoController.getPhotosPerPage);



  router.post('/u', photoController.uploadPhoto);
  module.exports = router;