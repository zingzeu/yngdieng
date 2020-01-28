import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchForm
  private router : Router;

  constructor(router: Router, formBuilder: FormBuilder) { 
    this.router = router;
    this.searchForm = formBuilder.group({
      textQuery: '',
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    let textQuery = this.searchForm.controls.textQuery.value;
    this.router.navigate(["/search", textQuery])
  }

}
