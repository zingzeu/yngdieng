import {Injectable} from '@angular/core';
import {Word} from '../../../yngdieng/admin/v1/resources_pb';
import {
  GetWordRequest,
  ListWordsRequest,
  ListWordsResponse,
  BatchGetPronsRequest,
  BatchGetPronsResponse,
} from '../../../yngdieng/admin/v1/service_pb';
import {AdminServiceClient} from '../../../yngdieng/admin/v1/service_grpc_web_pb';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YngdiengAdminService {
  private grpcClient: AdminServiceClient;
  constructor() {
    this.grpcClient = new AdminServiceClient('http://localhost:5000');
  }

  getWord(name): Promise<Word> {
    let request = new GetWordRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.grpcClient.getWord(request, undefined, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
  listWords(offset, pageSize = 10): Promise<ListWordsResponse> {
    let request = new ListWordsRequest();
    request.setOffset(offset);
    request.setPageSize(pageSize);
    return new Promise((resolve, reject) => {
      this.grpcClient.listWords(request, undefined, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  listWords$(offset, pageSize = 10): Observable<ListWordsResponse> {
    return from(this.listWords(offset, pageSize));
  }

  batchGetProns(parent, names: string[]): Promise<BatchGetPronsResponse> {
    let request = new BatchGetPronsRequest();
    request.setParent(parent);
    request.setNamesList(names);
    return new Promise((resolve, reject) => {
      this.grpcClient.batchGetProns(request, undefined, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  batchGetProns$(parent, names: string[]): Observable<BatchGetPronsResponse> {
    return from(this.batchGetProns(parent, names));
  }
}
