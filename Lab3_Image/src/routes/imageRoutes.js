const express = require('express');
const upload = require('../middlewares/fileMiddleware');
const { createBinary, getBinaryById} = require('../controllers/imageController');
const keycloak = require("../middlewares/authMiddleware")

const router = express.Router();

router.post('/create-binary', keycloak.protect(), upload.single("image"), createBinary);
router.get("/get-binary-by-id", keycloak.protect(), getBinaryById)

module.exports = router;