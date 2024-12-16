const axios = require('axios');
const { FHIR_SERVER_BINARY_URL } = require('../config/fhirConfig');

const createBinary = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded');
    }

    try {

        const response = await axios.post(FHIR_SERVER_BINARY_URL, req.file.buffer, {
            headers: { 'Content-Type': req.file.mimetype },
        });

        if (response.status === 201) {
            const locationHeader = response.headers["location"];
            const binaryId = locationHeader.split('/')[5];

            return res.status(201).send(binaryId);
        } else {
            return res.status(response.status).send('Error uploading image');
        }

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('Error uploading image');
    }
};

const getBinaryById = async (req, res) => {
    const { imageId } = req.query;

    try {
        const response = await axios.get(`${FHIR_SERVER_BINARY_URL}/${imageId}`, {
            responseType: "stream"
        });

        if (response.status === 200) {
            res.set({
                'Content-Type': response.headers['content-type']
            });
            res.status(200)
            return response.data.pipe(res);
        } else {
            return res.status(response.status).send('Error loading image');
        }

    } catch (error) {
        console.error('Error loading image:', error);
        return res.status(500).send('Error loading image');
    }
};

module.exports = {
    createBinary, getBinaryById
};