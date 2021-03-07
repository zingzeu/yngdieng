import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {Word} from 'yngdieng/yngdieng/frontend/v3/service_pb';

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
    return this.backendService.getWord(route.paramMap.get('id')).pipe(
      map(word => ({word, error: false} as WordDetailsResolveResult)),
      catchError(e => {
        console.log('Error in WordDetailsResolverService: ', e);
        return of({error: true} as WordDetailsResolveResult);
      })
    );
  }
}

export interface WordDetailsResolveResult {
  word?: Word;
  error: boolean;
}
