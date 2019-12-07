import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultComponent } from "./search-result/search-result.component";
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: "", component:HomeComponent},
  { path:"search/:query", component: SearchResultComponent},
  { path: "search", component: SearchLandingComponent},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
