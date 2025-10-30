const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controller/LikeController');

router.use(express.json());

router.post('/:id', toggleLike);

module.exports = router;
