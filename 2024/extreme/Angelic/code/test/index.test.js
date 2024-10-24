const fs = require('fs');
const axios = require('axios').default;
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;

jest.setTimeout(300000)

const fallenKey = faker.string.alphanumeric(64);
const generalKey = faker.string.alphanumeric(64);

beforeAll(async () => {
    const generateService = (name, key) => {
        const server = `import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/http.dart';
import 'dart:io' show Platform;

main() async {

    Map<String, String> cfg = Platform.environment;

    var app = Angel();

    app.get('/', (req, res) {
        res.write('${key}');
    });

    app.get('/system/info', (req, res) {
        res.write('You\\'ve reached the land of ${name === "fallen" ? name + " " : ""}angels. System version: \${cfg['SERVICE_VERSION']}');
    });

    var http = AngelHttp(app);

    await http.startServer(cfg['SERVICE_HOST'], int.parse(cfg['SERVICE_PORT']));
}`
        const pubspec = `name: ${name}
        
environment:
    sdk: '>=2.10.0 <3.0.0'

dependencies:
    angel_framework: ^2.0.0`


        fs.mkdirSync("./src/" + name, { recursive: true });

        fs.writeFileSync(`./src/${name}/main.dart`, server);

        fs.writeFileSync(`./src/${name}/pubspec.yaml`, pubspec);

    }

    if (fs.existsSync("./src")) {
        fs.rmdirSync("./src", { recursive: true });
    }

    generateService("fallen", fallenKey);
    generateService("general", generalKey);

    await exec('bash execute.sh')
});

describe('primary tests', () => {
    test('general service key', async () => {
        const generalKeyResponse = await axios.get('http://angelic.bashaway.sliitfoss.org');
        expect(generalKeyResponse.data).toBe(generalKey);
    });

    test('general service system info', async () => {
        const generalSystemInfoResponse = await axios.get('http://angelic.bashaway.sliitfoss.org/system/info');
        expect(generalSystemInfoResponse.data).toBe(`You've reached the land of angels. System version: 1.0.0`);
    });

    test('fallen service key', async () => {
        const fallenKeyResponse = await axios.get('http://angelic.bashaway.sliitfoss.org/fallen');
        expect(fallenKeyResponse.data).toBe(fallenKey);
    });

    test('fallen service system info', async () => {
        const fallenSystemInfoResponse = await axios.get('http://angelic.bashaway.sliitfoss.org/fallen/system/info');
        expect(fallenSystemInfoResponse.data).toBe(`You've reached the land of fallen angels. System version: 1.0.0`);
    });

    test('404 response', async () => {
        const notFoundResponse = await axios.get('http://angelic.bashaway.sliitfoss.org/blablabla').catch(e => e.response);
        expect(notFoundResponse.status).toBe(404);
        expect(notFoundResponse.data).toBe('Lost in the Abyss, path not found');
    })

    test('should check if there is a kubernetes service named fallen', async () => {
        const response = await exec('bash -c "kubectl get services -n lifeforge | grep fallen"');
        expect(response).toContain('fallen');
    });

    test('should check if there is a kubernetes service named general', async () => {
        const response = await exec('bash -c "kubectl get services -n lifeforge | grep general"');
        expect(response).toContain('general');
    });

    test('should check if the services are running', async () => {
        const response = await exec('bash -c "kubectl get pods -n lifeforge | grep Running"');
        expect(response).toContain('Running');
    });
});

describe('integrity tests', () => {
    beforeAll(async () => {
        await Promise.all([
            exec('bash -c "kubectl delete deployment -n lifeforge --all"'),
            exec('bash -c "kubectl delete service -n lifeforge --all"'),
            exec('bash -c "kubectl delete pod -n lifeforge --all"')
        ]);
    });
    test('general response should error out', async () => {
        const generalResponseErr = await axios.get('http://angelic.bashaway.sliitfoss.org').catch(e => e);
        expect(generalResponseErr.message).toBe("Request failed with status code 503")
    });
    test('fallen response should error out', async () => {
        const fallenResponseErr = await axios.get('http://angelic.bashaway.sliitfoss.org/fallen').catch(e => e);
        expect(fallenResponseErr.message).toBe("Request failed with status code 503")
    });
});