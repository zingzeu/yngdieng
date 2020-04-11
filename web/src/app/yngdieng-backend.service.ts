import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AggregatedDocument, FengDocument} from 'yngdieng/shared/documents_pb';
import {DebugInfo, GetAggregatedDocumentRequest, GetDebugInfoRequest, GetFengDocumentRequest, SearchRequest, SearchResponse} from 'yngdieng/shared/services_pb';
import {YngdiengServiceClient} from 'yngdieng/shared/services_pb_service';

import {IYngdiengEnvironment, YNGDIENG_ENVIRONMENT} from '../environments/environment';

@Injectable({providedIn: 'root'})
export class YngdiengBackendService {
  private grpcClient: YngdiengServiceClient;

  constructor(@Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment) {
    this.grpcClient = new YngdiengServiceClient(this.environment.serverUrl);
  }

  search(queryText: string, offset: number = 0): Observable<SearchResponse> {
    let subject = new Subject<SearchResponse>();
    let request = new SearchRequest();
    request.setQuery(queryText);
    request.setOffset(offset);

    this.grpcClient.search(request, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }

      subject.next(response);
    })

    return subject.asObservable();
  }

  getFengDocument(fengDocId: string): Observable<FengDocument> {
    let subject = new Subject<FengDocument>();
    let request = new GetFengDocumentRequest();
    request.setId(fengDocId);
    this.grpcClient.getFengDocument(request, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }

      subject.next(response);
    })

    return subject.asObservable();
  }

  getAggregatedDocument(docId: string): Observable<AggregatedDocument> {
    let subject = new Subject<AggregatedDocument>();
    let request = new GetAggregatedDocumentRequest();
    request.setId(docId);
    this.grpcClient.getAggregatedDocument(request, (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }

      subject.next(response);
    })

    return subject.asObservable();
  }

  getDebugInfo(): Observable<DebugInfo> {
    let subject = new Subject<DebugInfo>();
    this.grpcClient.getDebugInfo(new GetDebugInfoRequest(), (err, response) => {
      if (err != null) {
        subject.error(err);
        return;
      }
      subject.next(response);
    })

    return subject.asObservable();
  }
}
