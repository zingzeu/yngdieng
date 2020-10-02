import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {
  FengDocument,
  HistoricalDocument,
  YngdiengDocument,
} from '../../../shared/documents_pb';
import {
  DebugInfo,
  GetAggregatedDocumentRequest,
  GetDebugInfoRequest,
  GetFengDocumentRequest,
  GetYngdiengDocumentRequest,
  SearchRequest,
  SearchResponse,
  SearchV2Request,
  SearchV2Response,
  ZhConversionPreference,
  UserPreference,
} from '../../../shared/services_pb';
import {YngdiengServiceClient} from '../../../shared/services_grpc_web_pb';

import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../environments/environment';
import * as jspb from 'google-protobuf';
@Injectable({providedIn: 'root'})
export class YngdiengBackendService {
  private grpcClient: YngdiengServiceClient;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment
  ) {
    this.grpcClient = new YngdiengServiceClient(this.environment.serverUrl);
  }

  search(queryText: string, offset: number = 0): Observable<SearchResponse> {
    let subject = new Subject<SearchResponse>();
    let request = new SearchRequest();
    request.setQuery(queryText);
    request.setOffset(offset);

    this.grpcClient.search(request, undefined, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }

      subject.next(response);
    });

    return subject.asObservable();
  }

  searchV2(queryText: string, pageToken: string): Observable<SearchV2Response> {
    let subject = new Subject<SearchV2Response>();
    let request = new SearchV2Request();
    request.setQuery(queryText);
    request.setPageToken(pageToken);
    // TODO: parameterize
    request.setPageSize(15);

    this.grpcClient.searchV2(
      request,
      {'x-yngdieng-options': this.getUserPreference()},
      (err, response) => {
        if (err != null) {
          subject.error(err);
          return;
        }

        subject.next(response);
      }
    );

    return subject.asObservable();
  }

  private getUserPreference() {
    let userPreference = new UserPreference();
    userPreference.setZhConversionPreference(
      ZhConversionPreference.LANGAUGE_PREFERENCE_HANS
    );
    return jspb.Message.bytesAsB64(userPreference.serializeBinary());
  }

  getFengDocument(fengDocId: string): Observable<FengDocument> {
    let subject = new Subject<FengDocument>();
    let request = new GetFengDocumentRequest();
    request.setId(fengDocId);
    this.grpcClient.getFengDocument(request, undefined, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }
      subject.next(response);
    });
    return subject.asObservable();
  }

  getYngdiengDocument(docId: string): Observable<YngdiengDocument> {
    let subject = new Subject<YngdiengDocument>();
    let request = new GetYngdiengDocumentRequest();
    request.setId(docId);
    this.grpcClient.getYngdiengDocument(request, undefined, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }
      subject.next(response);
    });
    return subject.asObservable();
  }

  getHistoricalDocument(docId: string): Observable<HistoricalDocument> {
    let subject = new Subject<HistoricalDocument>();
    let request = new GetAggregatedDocumentRequest();
    request.setId(docId);
    this.grpcClient.getAggregatedDocument(
      request,
      undefined,
      (err, response) => {
        if (err != null) {
          subject.error(err);
          return;
        }

        subject.next(response);
      }
    );

    return subject.asObservable();
  }

  getDebugInfo(): Observable<DebugInfo> {
    let subject = new Subject<DebugInfo>();
    this.grpcClient.getDebugInfo(
      new GetDebugInfoRequest(),
      undefined,
      (err, response) => {
        if (err != null) {
          subject.error(err);
          return;
        }
        subject.next(response);
      }
    );

    return subject.asObservable();
  }
}
