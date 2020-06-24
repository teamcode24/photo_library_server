const router = require('express').Router();
const imageController = require('../controllers/image.controller')
const validateToken = require('../middlewares/validateToken');
 /* ==============
     Get All Image Route
  ============== */
  router.get('/',validateToken, imageController.getImages);


 /* ==============
     Get Image Route
  ============== */
  router.get('/:id',validateToken, imageController.getImage);

   /* ==============
     Get Categories Image Route
  ============== */
  router.get('/t/:topic',validateToken, imageController.getImagesByTopic);
  
     /* ==============
     Get Image By Search Route
  ============== */
  router.get('/s/:search',validateToken, imageController.getImageBySearch);
  
   /* ==============
     Get Image Per Page Route
  ============== */
  router.get('/p/:page',validateToken, imageController.getImagesPerPage);

  module.exports = router;