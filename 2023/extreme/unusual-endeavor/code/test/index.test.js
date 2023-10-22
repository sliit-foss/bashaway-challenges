const imaps = require('imap-simple');

test('should validate if a mail is present in the inbox', async () => {
    let debugOutput = '';
    await new Promise((resolve) => {
        imaps.connect({
            imap: {
                user: "inventor@bashaway2k23.net",
                password: "123456",
                host: 'localhost',
                port: 1636,
                debug: (debug) => {
                    debugOutput += debug;
                }
            }
        }).then(function (connection) {
            return connection.openBox('INBOX').then(function () {
                return connection.search(['UNSEEN'], {}).then(()=>{
                    connection.end();
                    resolve(debugOutput);
                });
            });
        });
    })
    expect(debugOutput).toContain("1 EXISTS");
    expect(debugOutput).toContain("[UNSEEN 1] Message 1 is the first unseen");
});