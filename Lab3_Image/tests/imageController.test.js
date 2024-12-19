const axios = require('axios');
const { createBinary, getBinaryById } = require('../src/controllers/imageController');
const { FHIR_SERVER_BINARY_URL } = require('../src/config/fhirConfig');

jest.mock('axios');

describe('Image Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createBinary', () => {
        it('should return binary ID when the image is uploaded successfully', async () => {
            const req = {
                file: {
                    buffer: Buffer.from('test-image-buffer'),
                    mimetype: 'image/jpeg',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            axios.post.mockResolvedValue({
                status: 201,
                headers: {
                    location: `${FHIR_SERVER_BINARY_URL}/123456`,
                },
            });

            await createBinary(req, res);

            expect(axios.post).toHaveBeenCalledWith(
                FHIR_SERVER_BINARY_URL,
                req.file.buffer,
                { headers: { 'Content-Type': req.file.mimetype } }
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('123456');
        });

        it('should return 400 if no image is uploaded', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await createBinary(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('No image uploaded');
        });

        it('should return 500 on server error', async () => {
            const req = {
                file: {
                    buffer: Buffer.from('test-image-buffer'),
                    mimetype: 'image/jpeg',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            axios.post.mockRejectedValue(new Error('Server error'));

            await createBinary(req, res);

            expect(axios.post).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error uploading image');
        });
    });

    describe('getBinaryById', () => {
        it('should return the image as a stream when binary is fetched successfully', async () => {
            const req = { query: { imageId: '12345' } };
            const res = {
                set: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                pipe: jest.fn(),
            };

            const mockStream = { pipe: jest.fn() };

            axios.get.mockResolvedValue({
                status: 200,
                headers: { 'content-type': 'image/jpeg' },
                data: mockStream,
            });

            await getBinaryById(req, res);

            expect(axios.get).toHaveBeenCalledWith(`${FHIR_SERVER_BINARY_URL}/12345`, {
                responseType: 'stream',
            });
            expect(res.set).toHaveBeenCalledWith({ 'Content-Type': 'image/jpeg' });
            expect(mockStream.pipe).toHaveBeenCalledWith(res);
        });

        it('should return 500 on server error', async () => {
            const req = { query: { imageId: '12345' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            axios.get.mockRejectedValue(new Error('Server error'));

            await getBinaryById(req, res);

            expect(axios.get).toHaveBeenCalledWith(`${FHIR_SERVER_BINARY_URL}/12345`, {
                responseType: 'stream',
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error loading image');
        });
    });
});
