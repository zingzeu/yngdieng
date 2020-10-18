import {Component} from '@angular/core';

import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  template:
    '<button  mat-stroked-button (click)="auth.loginWithRedirect()">登录</button>',
})
export class AuthButtonComponent {
  constructor(public auth: AuthService) {}
}
