const fs = require('fs');
const axios = require('axios').default;
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(150000)

const endpointResponses = {}

beforeAll(async () => {
    const endpointCount = faker.number.int({ min: 50, max: 100 });

    let routeConditions = "";

    for (let i = 0; i < endpointCount; i++) {
        const path = faker.string.alphanumeric(30);
        endpointResponses[path] = faker.string.alphanumeric(64);
        routeConditions += `${i == 0 ? "if" : "else if"} (req.method() == http::verb::get && req.target() == "/${path}") {
        set_success_response(res, "${endpointResponses[path]}");
    } `
    }

    const server = `#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/strand.hpp>
#include <boost/config.hpp>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>

namespace beast = boost::beast;
namespace http = beast::http;
namespace net = boost::asio;
using tcp = net::ip::tcp;

void set_success_response(http::response<http::string_body>& res, const std::string& body)
{
    res.result(http::status::ok);
    res.set(http::field::server, "Boost.Beast");
    res.set(http::field::content_type, "text/plain");
    res.body() = body;
    res.prepare_payload();
}

void handle_request(http::request<http::string_body> req, http::response<http::string_body>& res)
{
    ${routeConditions}
    else
    {
        res.result(http::status::not_found);
        res.set(http::field::content_type, "text/plain");
        res.body() = "Not Found";
        res.prepare_payload();
    }
}

void session(tcp::socket socket)
{
    beast::error_code ec;

    beast::flat_buffer buffer;

    http::request<http::string_body> req;
    http::read(socket, buffer, req, ec);

    if (ec == http::error::end_of_stream)
        return;

    http::response<http::string_body> res;
    handle_request(req, res);

    http::write(socket, res, ec);
}

void listener(net::io_context& ioc, tcp::endpoint endpoint)
{
    tcp::acceptor acceptor(ioc);

    acceptor.open(endpoint.protocol());
    acceptor.set_option(net::socket_base::reuse_address(true));
    acceptor.bind(endpoint);
    acceptor.listen(net::socket_base::max_listen_connections);

    for (;;)
    {
        tcp::socket socket(ioc);
        acceptor.accept(socket);
        std::thread(session, std::move(socket)).detach();
    }
}

int main()
{
    try
    {
        net::io_context ioc{1};
        tcp::endpoint endpoint{tcp::v4(), 8080};
        listener(ioc, endpoint);
    }
    catch (std::exception& e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
        return EXIT_FAILURE;
    }
}`

    if (fs.existsSync("./src")) {
        fs.rmdirSync("./src", { recursive: true });
    }

    fs.mkdirSync("./src", { recursive: true });

    fs.writeFileSync('./src/server.cpp', server);

    await exec('bash execute.sh')
});

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
        await expect(dependencyCount()).resolves.toStrictEqual(5)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

describe('primary tests', () => {
    const randomPath = () => Object.keys(endpointResponses)[faker.number.int({ min: 0, max: Object.keys(endpointResponses).length - 1 })];
    test('should check if rate limiting applies correctly', async () => {
        for (let i = 0; i < 5; i++) {
            const path = randomPath();
            const responseStr = endpointResponses[path];
            const response = await axios.get(`http://localhost:8000/${path}`);
            expect(response.data).toBe(responseStr);
        }

        let path = randomPath();
        let response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 1000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 1000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 1000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 1000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 1000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 5000));
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);

        await new Promise(resolve => setTimeout(resolve, 60000));
        for (let i = 0; i < 5; i++) {
            const path = randomPath();
            const responseStr = endpointResponses[path];
            const response = await axios.get(`http://localhost:8000/${path}`);
            expect(response.data).toBe(responseStr);
        }
        path = randomPath();
        response = await axios.get(`http://localhost:8000/${path}`).catch((e) => e.response);
        expect(response.status).toBe(429);
    });
    test('base server should have no rate limiting', async () => {
        for (let i = 0; i < 10; i++) {
            const path = randomPath();
            const responseStr = endpointResponses[path];
            const response = await axios.get(`http://localhost:7000/${path}`);
            expect(response.data).toBe(responseStr);
        }
    });
});

describe('integrity tests', () => {
    beforeAll(async () => {
        await exec('bash -c "kill -9 $(lsof -t -i:7000)"');
    });
    test('general response should error out', async () => {
        await expect(axios.get('http://localhost:7000')).rejects.toBeInstanceOf(Error);
    });
    test('proxy response should error out', async () => {
        await expect(axios.get('http://localhost:8000')).rejects.toBeInstanceOf(Error);
    });
});