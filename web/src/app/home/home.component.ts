import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {SidenavStateService} from '../sidenav-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchForm;
  private router: Router;

  constructor(router: Router, formBuilder: FormBuilder) {
    this.router = router;
    this.searchForm = formBuilder.group({
      textQuery: '',
    });
  }

  ngOnInit() {}

  onSubmit() {
    let textQuery = this.searchForm.controls.textQuery.value;
    this.router.navigate(['/search', textQuery])
  }

}
