import {Injectable} from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {Word} from '../../../../yngdieng/admin/v1/resources_pb';
import {YngdiengAdminService} from '../yngdieng-admin.service';
@Injectable({
  providedIn: 'root',
})
export class WordDetailsResolverService implements Resolve<Word> {
  constructor(private adminService: YngdiengAdminService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.adminService.getWord('words/' + route.paramMap.get('id'));
  }
}
