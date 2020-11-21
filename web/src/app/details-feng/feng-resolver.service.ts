import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FengDocument} from '../../../../shared/documents_pb';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Injectable({
  providedIn: 'root',
})
export class FengResolverService implements Resolve<FengResolveResult> {
  constructor(private backendService: YngdiengBackendService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<FengResolveResult> {
    return this.backendService.getFengDocument(route.paramMap.get('id')).pipe(
      catchError(e => {
        console.log('Error in FengResolverService: ', e);
        return of({error: ErrorType.NetworkError} as FengResolveResult);
      }),
      map(fengDoc => ({fengDoc: fengDoc} as FengResolveResult))
    );
  }
}

export interface FengResolveResult {
  fengDoc?: FengDocument;
  error?: ErrorType;
}

export enum ErrorType {
  NotFound,
  NetworkError,
}
