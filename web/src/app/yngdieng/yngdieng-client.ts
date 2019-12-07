import {SearchRequest, SearchResponse, GetDocumentRequest, GetDocumentResponse, Query} from './services_pb';
import { YngdiengServiceClient } from './services_grpc_web_pb';


var client = new YngdiengServiceClient('http://localhost:8080');

var query = new Query();
query.setHanziQuery('我');
var request = new SearchRequest();
request.setQuery(query);

client.getSearch(request, {}, (err, response) => {
  console.log(response.toObject().documentsList);
});