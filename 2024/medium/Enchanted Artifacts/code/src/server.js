import * as fs from 'fs';

Bun.serve({
    port: 3000,
    fetch() {
        const envExampleLines = fs.readFileSync('.env.example', 'utf8').split('\n');
        const keys = envExampleLines.reduce((acc, line) => {
            const [key] = line.split('=');
            acc[key] = process.env[key];
            return acc;
        }, {});
        return new Response(JSON.stringify(keys), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
});