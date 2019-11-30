const {SearchRequest, SearchResponse, GetDocumentRequest, GetDocumentResponse} = require('./services_pb.js');
const {YngdiengClient} = require('./services_grpc_web_pb.js');

var client = new YngdiengServiceClient('http://localhost:8080');

var request = new SearchRequest();
request.setHanzi('我');

client.getSearch(request, {}, (err, response) => {
  console.log(response.getMessage());
});