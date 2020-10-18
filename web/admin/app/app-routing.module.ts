import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {WordsOverviewComponent} from './words-overview/words-overview.component';
import {WordDetailsComponent} from './word-details/word-details.component';
import {WordDetailsResolverService} from './word-details/word-details-resolver.service';
import {AuthGuard} from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: 'words/:id',
    component: WordDetailsComponent,
    resolve: {word: WordDetailsResolverService},
    canActivate: [AuthGuard],
  },
  {path: 'words', component: WordsOverviewComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
