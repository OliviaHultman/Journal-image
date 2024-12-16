const express = require('express');
const upload = require('../middlewares/fileMiddleware');
const { createBinary, getBinaryById} = require('../controllers/imageController');

const router = express.Router();

router.post('/create-binary', upload.single("image"), createBinary);
router.get("/get-binary-by-id", getBinaryById)

module.exports = router;