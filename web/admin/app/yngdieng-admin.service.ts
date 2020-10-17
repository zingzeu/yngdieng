import {Injectable} from '@angular/core';
import {
  ListWordsRequest,
  ListWordsResponse,
} from '../../../yngdieng/admin/v1/service_pb';
import {AdminServiceClient as XAdminServiceClient} from '../../../yngdieng/admin/v1/service_grpc_web_pb';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YngdiengAdminService {
  private grpcClient: XAdminServiceClient;
  constructor() {
    this.grpcClient = new XAdminServiceClient('http://localhost:5000');
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
}
