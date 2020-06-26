const router = require('express').Router();
const topicController = require('../controllers/topic.controller')
const validateToken = require('../middlewares/validateToken');
 /* ==============
     Get All Image Route
  ============== */
  router.get('/', topicController.getTopics);


  module.exports = router;