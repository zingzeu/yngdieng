import {Component} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  template: `
    <span *ngIf="auth.user$ | async as user">
      <small>{{ user.name }}({{ user.email }})</small>
    </span>
  `,
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}
