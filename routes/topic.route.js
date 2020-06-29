const router = require('express').Router();
const topicController = require('../controllers/topic.controller');
const validateToken = require('../middlewares/validateToken');
/* ==============
     Get All Image Route
  ============== */
router.get('/', topicController.getTopics);
router.get('/list', topicController.getTopicList);

router.get('/:topic', topicController.getTopic);

router.post('/', topicController.createTopic);
module.exports = router;
