const express = require('express');
const upload = require('../middlewares/fileMiddleware');
const { uploadImage } = require('../controllers/imageController');

const router = express.Router();

router.post('/upload-image', upload.single("image"), uploadImage);

module.exports = router;