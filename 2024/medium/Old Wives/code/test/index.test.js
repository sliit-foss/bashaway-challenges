const fs = require('fs');
const express = require('express');
const axios = require('axios').default;
const { initTracer } = require("jaeger-client");
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const { faker } = require('@faker-js/faker');
const { scan, shellFiles, dependencyCount, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(9)
    });
});

describe('should check if the primary requirements are met', () => {
    let server, tracer;
    const responseKey = faker.string.uuid();
    const randomPort = faker.number.int({ min: 3000, max: 5000 });

    let traceID = ""
    let error = false;

    beforeAll(async () => {
        tracer = initTracer({
            serviceName: 'my-awesome-service',
            sampler: {
                type: "const",
                param: 1,
            },
            reporter: {
                collectorEndpoint: `${process.env.JEAGER_COLLECTOR_ENDPOINT}/api/traces`,
                logSpans: true,
            },
        }, {
            logger: {
                info(msg) {
                    traceID = msg.split(" ")[2].split(":")[0]?.trim();
                    console.log("INFO ", msg);
                },
                error(msg) {
                    error = true;
                    console.log("ERROR", msg);
                },
            },
        });
        const app = express();
        app.get('/', (req, res) => {
            const span = tracer.startSpan('root-span');
            const requestId = Date.now().toString();
            span.setTag(Tags.HTTP_URL, req.url);
            span.setTag(Tags.HTTP_METHOD, req.method);
            span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
            span.setTag("requestId", requestId);
            span.log({ event: 'request-received' });
            tracer.inject(span, FORMAT_HTTP_HEADERS, req.headers);
            res.send(responseKey);
            span.log({ event: 'response-sent', responseKey });
            span.finish();
        });
        server = app.listen(randomPort);
    });

    test('response should be equal to the response key', async () => {
        const response = await axios.get(`http://localhost:${randomPort}`);
        expect(response.data).toBe(responseKey);
    });

    test('trace ID should be present in the logs', async () => {
        await new Promise(resolve => setTimeout(resolve, 2500));
        const response = await axios.get(`${process.env.JAEGER_QUERY_ENDPOINT}/api/traces/${traceID}?prettyPrint=true`);
        expect(response.data.data[0].traceID).toBe(traceID);
        expect(response.data.data[0].spans[0].logs[1].fields[1].key).toBe("responseKey");
        expect(response.data.data[0].spans[0].logs[1].fields[1].value).toBe(responseKey);
    });

    test('there should be no errors', () => {
        expect(error).toBe(false);
    });

    afterAll(async () => {
        await server.close();
        await tracer.close();
    });
});