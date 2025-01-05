const Keycloak = require("keycloak-connect");
const axios = require('axios');
const { FHIR_SERVER_PATIENT_URL, FHIR_SERVER_OBSERVATION_URL} = require('../config/fhirConfig');

const keycloak = new Keycloak({});

const protectByIdAndRole = async (token, req) => {
    try {
        if (!token.hasRole("realm:patient")) {
            return true
        }

        const { imageId } = req.query;

        const observationResponse = await axios.get(FHIR_SERVER_OBSERVATION_URL, {
            params: {
                focus: `Binary/${imageId}`
            }
        });

        if (observationResponse.status !== 200) {
            return false;
        }

        const patientId = observationResponse.data.entry[0]?.resource?.subject?.reference.split("/")[1];

        const patientResponse = await axios.get(`${FHIR_SERVER_PATIENT_URL}/${patientId}`);

        if (patientResponse.status !== 200) {
            return false;
        }

        const patientIdentifier = await patientResponse.data.identifier[0].value;
        
        return patientIdentifier === token.content.preferred_username;
    }
    catch (error) {
        console.error('Error loading patient:', error);
        return false;
    }
}

module.exports = {
    keycloak, protectByIdAndRole
};