const express = require('express');
const router = express.Router();

const reviewsController = require('../controllers/review_controller');

router.post('/assign-review/:id', reviewsController.assignReview);
router.post('/create/:id', reviewsController.submitReview);
router.post('/update-review/:id', reviewsController.updateReview)

module.exports = router;
