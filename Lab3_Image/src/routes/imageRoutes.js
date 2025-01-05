const express = require('express');
const upload = require('../middlewares/fileMiddleware');
const { createBinary, getBinaryById} = require('../controllers/imageController');
const { keycloak, protectByIdAndRole } = require("../middlewares/authMiddleware")

const router = express.Router();

router.post('/create-binary', keycloak.protect(), upload.single("image"), createBinary);
router.get("/get-binary-by-id", keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authorized = await protectByIdAndRole(token, req);

    if (authorized) {
        return getBinaryById(req, res);
    } else {
        return res.status(403).send("Unauthorized to access image");
    }
})

module.exports = router;