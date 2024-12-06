const express = require('express');
const upload = require('../middlewares/fileMiddleware');
const { createBinary } = require('../controllers/imageController');

const router = express.Router();

router.post('/create-binary', upload.single("image"), createBinary);

module.exports = router;