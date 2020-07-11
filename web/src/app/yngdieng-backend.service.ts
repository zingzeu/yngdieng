import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FengDocument, HistoricalDocument} from 'yngdieng/shared/documents_pb';
import {DebugInfo, GetDebugInfoRequest, GetFengDocumentRequest, GetHistoricalDocumentRequest, SearchRequest, SearchResponse} from 'yngdieng/shared/services_pb';
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

  getHistoricalDocument(docId: string): Observable<HistoricalDocument> {
    let subject = new Subject<HistoricalDocument>();
    let request = new GetHistoricalDocumentRequest();
    request.setId(docId);
    this.grpcClient.getHistoricalDocument(request, (err, response) => {
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
