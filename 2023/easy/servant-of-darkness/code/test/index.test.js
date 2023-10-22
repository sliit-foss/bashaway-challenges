const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { faker } = require('@faker-js/faker');
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(15000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**', '**azurite*.json']).length);
});

describe('should create and download a blob successfully', () => {
    const containerName = 'bashaway';

    const blobServiceClient = new BlobServiceClient(
        `http://devstoreaccount1.blob.core.windows.net:12000`,
        new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
    );

    let containerClient;

    beforeAll(async () => {
        containerClient = blobServiceClient.getContainerClient(containerName);
        if (!await containerClient.exists()) await containerClient.create().catch(console.log);
    });

    afterAll((done) => done());

    const streamToString = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString("utf-8");
    }

    const fileName = faker.system.fileName();
    const fileContent = faker.string.alphanumeric(500)

    test('should create a blob successfully', async () => {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const uploadBlobResponse = await blockBlobClient.upload(fileContent, fileContent.length);
        expect(uploadBlobResponse._response.status).toBe(201);
    });

    test('should download a blob successfully', async () => {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        expect(downloadedContent).toBe(fileContent);
    });

    test('should delete a blob successfully', async () => {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const deleteBlobResponse = await blockBlobClient.delete();
        expect(deleteBlobResponse._response.status).toBe(202);
    });
});