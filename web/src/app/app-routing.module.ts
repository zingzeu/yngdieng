import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdvancedSearchLandingComponent} from './advanced-search-landing/advanced-search-landing.component';
import {DebugInfoComponent} from './debug-info/debug-info.component';
import {DetailsFengComponent} from './details-feng/details-feng.component';
import {DetailsMonoHanziComponent} from './details-mono-hanzi/details-mono-hanzi.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {SearchResultComponent} from './search-result/search-result.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'search/:query', component: SearchResultComponent},
  {path: 'advancedSearch', component: AdvancedSearchLandingComponent},
  {path: 'help', component: HelpComponent},
  {path: 'feng/:id', component: DetailsFengComponent},
  {path: 'char/:id', component: DetailsMonoHanziComponent},
  {path: '_debug', component: DebugInfoComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
