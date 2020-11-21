import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable} from 'rxjs';
import {FengDocument} from '../../../../shared/documents_pb';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Injectable({
  providedIn: 'root',
})
export class FengResolverService implements Resolve<FengDocument> {
  constructor(private backendService: YngdiengBackendService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<FengDocument> {
    return this.backendService.getFengDocument(route.paramMap.get('id'));
  }
}
