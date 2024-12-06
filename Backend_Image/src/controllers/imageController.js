const axios = require('axios');
const { FHIR_SERVER_BINARY_URL } = require('../config/fhirConfig');

const createBinary = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded');
    }

    try {
        const base64Image = req.file.buffer.toString('base64');

        const binary = {
            resourceType: 'Binary',
            contentType: req.file.mimetype,
            data: base64Image,
        };

        const response = await axios.post(FHIR_SERVER_BINARY_URL, binary, {
            headers: { 'Content-Type': 'application/json' },
        });

        const locationHeader = response.headers["location"];
        const binaryId = locationHeader.split('/')[5];

        return res.status(201).send(binaryId);

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('Error uploading image');
    }
};

module.exports = {
    createBinary
};