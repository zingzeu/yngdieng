import {Injectable} from '@angular/core';
import {Word} from 'yngdieng/yngdieng/admin/v1/resources_pb';
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
} from 'yngdieng/yngdieng/admin/v1/service_pb';
import {AdminServiceClient} from 'yngdieng/yngdieng/admin/v1/service_grpc_web_pb';
import {from, Observable} from 'rxjs';
import {AuthService} from '@auth0/auth0-angular';
@Injectable({
  providedIn: 'root',
})
export class YngdiengAdminService {
  private grpcClient: AdminServiceClient;
  private token: string;

  constructor(private auth: AuthService) {
    this.grpcClient = new AdminServiceClient('http://localhost:5000');
    this.auth
      .getAccessTokenSilently({})
      .subscribe(token => (this.token = token));
  }

  private getHeaders() {
    if (this.token?.length > 0) {
      return {
        Authorization: 'Bearer ' + this.token,
      };
    } else {
      return undefined;
    }
  }

  getWord(name): Promise<Word> {
    let request = new GetWordRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.grpcClient.getWord(request, this.getHeaders(), (err, response) => {
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
      this.grpcClient.listWords(request, this.getHeaders(), (err, response) => {
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
      this.grpcClient.batchGetProns(
        request,
        this.getHeaders(),
        (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        }
      );
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
      this.grpcClient.createPron(
        request,
        this.getHeaders(),
        (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        }
      );
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
      this.grpcClient.updatePron(
        request,
        this.getHeaders(),
        (err, response) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        }
      );
    });
  }

  updatePron$(pron: Pron, paths: string[]): Observable<Pron> {
    return from(this.updatePron(pron, paths));
  }

  deletePron(name: string): Promise<void> {
    let request = new DeletePronRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.grpcClient.deletePron(
        request,
        this.getHeaders(),
        (err, _response) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }
}
