import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultComponent } from "./search-result/search-result.component";
import { HomeComponent } from './home/home.component';
import { DetailsFengComponent } from './details-feng/details-feng.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "search/:query", component: SearchResultComponent },
  { path: "feng/:id", component: DetailsFengComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
