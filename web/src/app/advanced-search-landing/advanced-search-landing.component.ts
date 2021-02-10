import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-advanced-search-landing',
  templateUrl: './advanced-search-landing.component.html',
  styleUrls: ['./advanced-search-landing.component.scss'],
})
export class AdvancedSearchLandingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onNavigateBack() {
    this.router.navigate(['/']);
  }

  private redirectTo(commands: any[]) {
    this.router
      .navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(commands));
  }
}
