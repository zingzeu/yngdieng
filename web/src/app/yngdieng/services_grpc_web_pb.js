/**
 * @fileoverview gRPC-Web generated client stub for yngdieng
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var phonology_pb = require('./phonology_pb.js')

var documents_pb = require('./documents_pb.js')
const proto = {};
proto.yngdieng = require('./services_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.yngdieng.YngdiengServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.yngdieng.YngdiengServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.yngdieng.SearchRequest,
 *   !proto.yngdieng.SearchResponse>}
 */
const methodDescriptor_YngdiengService_GetSearch = new grpc.web.MethodDescriptor(
  '/yngdieng.YngdiengService/GetSearch',
  grpc.web.MethodType.UNARY,
  proto.yngdieng.SearchRequest,
  proto.yngdieng.SearchResponse,
  /**
   * @param {!proto.yngdieng.SearchRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.yngdieng.SearchResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.yngdieng.SearchRequest,
 *   !proto.yngdieng.SearchResponse>}
 */
const methodInfo_YngdiengService_GetSearch = new grpc.web.AbstractClientBase.MethodInfo(
  proto.yngdieng.SearchResponse,
  /**
   * @param {!proto.yngdieng.SearchRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.yngdieng.SearchResponse.deserializeBinary
);


/**
 * @param {!proto.yngdieng.SearchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.yngdieng.SearchResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.yngdieng.SearchResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.yngdieng.YngdiengServiceClient.prototype.getSearch =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/yngdieng.YngdiengService/GetSearch',
      request,
      metadata || {},
      methodDescriptor_YngdiengService_GetSearch,
      callback);
};


/**
 * @param {!proto.yngdieng.SearchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.yngdieng.SearchResponse>}
 *     A native promise that resolves to the response
 */
proto.yngdieng.YngdiengServicePromiseClient.prototype.getSearch =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/yngdieng.YngdiengService/GetSearch',
      request,
      metadata || {},
      methodDescriptor_YngdiengService_GetSearch);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.yngdieng.GetDocumentRequest,
 *   !proto.yngdieng.GetDocumentResponse>}
 */
const methodDescriptor_YngdiengService_GetDocument = new grpc.web.MethodDescriptor(
  '/yngdieng.YngdiengService/GetDocument',
  grpc.web.MethodType.UNARY,
  proto.yngdieng.GetDocumentRequest,
  proto.yngdieng.GetDocumentResponse,
  /**
   * @param {!proto.yngdieng.GetDocumentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.yngdieng.GetDocumentResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.yngdieng.GetDocumentRequest,
 *   !proto.yngdieng.GetDocumentResponse>}
 */
const methodInfo_YngdiengService_GetDocument = new grpc.web.AbstractClientBase.MethodInfo(
  proto.yngdieng.GetDocumentResponse,
  /**
   * @param {!proto.yngdieng.GetDocumentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.yngdieng.GetDocumentResponse.deserializeBinary
);


/**
 * @param {!proto.yngdieng.GetDocumentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.yngdieng.GetDocumentResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.yngdieng.GetDocumentResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.yngdieng.YngdiengServiceClient.prototype.getDocument =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/yngdieng.YngdiengService/GetDocument',
      request,
      metadata || {},
      methodDescriptor_YngdiengService_GetDocument,
      callback);
};


/**
 * @param {!proto.yngdieng.GetDocumentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.yngdieng.GetDocumentResponse>}
 *     A native promise that resolves to the response
 */
proto.yngdieng.YngdiengServicePromiseClient.prototype.getDocument =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/yngdieng.YngdiengService/GetDocument',
      request,
      metadata || {},
      methodDescriptor_YngdiengService_GetDocument);
};


module.exports = proto.yngdieng;

