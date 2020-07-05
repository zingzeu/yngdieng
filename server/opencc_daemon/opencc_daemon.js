const OpenCC = require('opencc');
const http = require('http');

// 福州话简繁转换规则
const hokchewConfigPath = require.resolve('../../thirdparty/zingzeu-data/opencc/t2sh.json');

const openccHokchew = new OpenCC(hokchewConfigPath);
const openccMandarin = new OpenCC('t2s.json');

const server = http.createServer((req, res) => {
    if (req.method == "POST") {
        var body = ''
        req.on('data', function (data) {
            body += data
        })
        req.on('end', function() {
          const isHokchew = req.url.trimRight().toLowerCase() === '/hokchew'
          console.log((isHokchew ? 'Hokchew: ' : 'Mandarin: ') + body)
          res.writeHead(200, {'Content-Type': 'text/plain'})
          res.end((isHokchew ? openccHokchew : openccMandarin).convertSync(body))
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end();
    }
});

server.listen(8081);
