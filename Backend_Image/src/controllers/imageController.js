const axios = require('axios');
const { FHIR_SERVER_MEDIA_URL } = require('../config/fhirConfig');

const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded');
    }

    try {
        const base64Image = req.file.buffer.toString('base64');

        const mediaResource = {
            resourceType: 'Media',
            type: {
                coding: [
                    {
                        system: 'http://terminology.hl7.org/CodeSystem/media-type',
                        code: 'image',
                        display: 'Image',
                    },
                ],
            },
            content: {
                attachment: {
                    contentType: req.file.mimetype,
                    data: base64Image,
                    title: req.file.originalname,
                },
            },
        };

        const response = await axios.post(FHIR_SERVER_MEDIA_URL, mediaResource, {
            headers: { 'Content-Type': 'application/json' },
        });

        const mediaId = response.data.id;

        return res.status(201).send(mediaId);

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('Error uploading image');
    }
};

module.exports = {
    uploadImage
};