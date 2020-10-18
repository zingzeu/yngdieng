import {Component, Inject} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        mat-stroked-button
        (click)="auth.logout({returnTo: document.location.origin})"
      >
        登出
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button mat-stroked-button (click)="auth.loginWithRedirect()">
        登录
      </button>
    </ng-template>
  `,
  styles: [],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}
}
