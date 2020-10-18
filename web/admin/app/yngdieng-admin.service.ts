import {Injectable} from '@angular/core';
import {Word} from '../../../yngdieng/admin/v1/resources_pb';
import {
  Pron,
  MyFieldMask,
  CreatePronRequest,
  UpdatePronRequest,
  GetWordRequest,
  DeletePronRequest,
  ListWordsRequest,
  ListWordsResponse,
  BatchGetPronsRequest,
  BatchGetPronsResponse,
} from '../../../yngdieng/admin/v1/service_pb';
import {AdminServiceClient} from '../../../yngdieng/admin/v1/service_grpc_web_pb';
import {from, Observable} from 'rxjs';
//import {FieldMask} from 'google-protobuf/google/protobuf/field_mask_pb';
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

  createPron(parent: string, pronuciation: string): Promise<Pron> {
    let request = new CreatePronRequest();
    request.setParent(parent);
    let pron = new Pron();
    pron.setPronunciation(pronuciation);
    request.setPron(pron);
    return new Promise((resolve, reject) => {
      this.grpcClient.createPron(request, undefined, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  createPron$(parent: string, pronuciation: string): Observable<Pron> {
    return from(this.createPron(parent, pronuciation));
  }

  updatePron(pron: Pron, paths: string[]): Promise<Pron> {
    let request = new UpdatePronRequest();
    request.setPron(pron);
    let fieldMask = new MyFieldMask();
    fieldMask.setPathsList(paths);
    request.setUpdateMask(fieldMask);
    return new Promise((resolve, reject) => {
      this.grpcClient.updatePron(request, undefined, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  updatePron$(pron: Pron, paths: string[]): Observable<Pron> {
    return from(this.updatePron(pron, paths));
  }

  deletePron(name: string): Promise<void> {
    let request = new DeletePronRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.grpcClient.deletePron(request, undefined, (err, _response) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
