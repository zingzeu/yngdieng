const OpenCC = require('opencc');
const http = require('http');

const opencc = new OpenCC('t2s.json');

const server = http.createServer((req, res) => {
    if (req.method == "POST") {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
            console.log('Received: ' + body)
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(opencc.convertSync(body));
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end();
    }
});

server.listen(8081);

