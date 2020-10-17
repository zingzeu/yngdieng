import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {WordsOverviewComponent} from './words-overview/words-overview.component';
import {WordDetailsComponent} from './word-details/word-details.component';
import {WordDetailsResolverService} from './word-details/word-details-resolver.service';

const routes: Routes = [
  {
    path: 'words/:id',
    component: WordDetailsComponent,
    resolve: {word: WordDetailsResolverService},
  },
  {path: 'words', component: WordsOverviewComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
