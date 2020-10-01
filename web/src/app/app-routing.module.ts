import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdvancedSearchLandingComponent} from './advanced-search-landing/advanced-search-landing.component';
import {DebugInfoComponent} from './debug-info/debug-info.component';
import {DetailsFengComponent} from './details-feng/details-feng.component';
import {DetailsMonoHanziComponent} from './details-mono-hanzi/details-mono-hanzi.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {SimplificationToolComponent} from './simplification-tool/simplification-tool.component';
import {WordDetailsComponent} from './word-details/word-details.component';
import {SearchV2ResultComponent} from './search-v2-result/search-v2-result.component';
import {AboutComponent} from './about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'search/:query', component: SearchResultComponent},
  {path: 'search2/:query/:pageToken', component: SearchV2ResultComponent},
  {path: 'search2/:query', component: SearchV2ResultComponent},
  {path: 'advancedSearch', component: AdvancedSearchLandingComponent},
  {path: 'about', component: AboutComponent},
  {path: 'help', component: HelpComponent},
  {path: 'w/:id', component: WordDetailsComponent},
  // (Deprecated) 冯版条目
  {path: 'feng/:id', component: DetailsFengComponent},
  // (Deprecated) 历史音韵条目(DFD、戚林)
  {path: 'char/:id', component: DetailsMonoHanziComponent},
  {path: 'tools/simplify', component: SimplificationToolComponent},
  {path: '_debug', component: DebugInfoComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {}
