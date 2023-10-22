const fs = require('fs');
const axios = require('axios').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test("should check if the webpage is being served properly", async () => {
    const content = fs.readFileSync('src/page.html', 'utf8');
    const response = await axios.get('http://localhost:8085');
    expect(response.data).toBe(content);
});