import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, switchMap, catchError} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengDocument} from '../../../../shared/documents_pb';

@Injectable({
  providedIn: 'root',
})
export class WordDetailsResolverService
  implements Resolve<WordDetailsResolveResult> {
  constructor(private backendService: YngdiengBackendService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<WordDetailsResolveResult> {
    return this.backendService
      .getYngdiengDocument(route.paramMap.get('id'))
      .pipe(
        catchError(e => {
          console.log('Error in WordDetailsResolverService: ', e);
          return of({error: true} as WordDetailsResolveResult);
        }),
        map(
          yngdiengDocument =>
            ({word: yngdiengDocument, error: false} as WordDetailsResolveResult)
        )
      );
  }
}

export interface WordDetailsResolveResult {
  word?: YngdiengDocument;
  error: boolean;
}
