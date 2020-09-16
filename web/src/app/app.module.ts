import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {YNGDIENG_ENVIRONMENT} from '../environments/environment';
import {YngdiengDevEnvironment} from '../environments/environment.dev';
import {YngdiengProdEnvironment} from '../environments/environment.prod';
import {YngdiengStagingEnvironment} from '../environments/environment.staging';
import {MaterialModule} from '../material/material.module';

import {AdvancedSearchLandingComponent} from './advanced-search-landing/advanced-search-landing.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {CommonToolbarComponent} from './common-toolbar/common-toolbar.component';
import {DebugInfoComponent} from './debug-info/debug-info.component';
import {DetailsFengComponent} from './details-feng/details-feng.component';
import {DetailsMonoHanziComponent} from './details-mono-hanzi/details-mono-hanzi.component';
import {FengExplanationComponent} from './feng-explanation/feng-explanation.component';
import {FengResultComponent} from './feng-result/feng-result.component';
import {HelpComponent} from './help/help.component';
import {HomeComponent} from './home/home.component';
import {MonoHanziResultComponent} from './mono-hanzi-result/mono-hanzi-result.component';
import {PhonologyComposerComponent} from './phonology-composer/phonology-composer.component';
import {PhonologyQueryRendererComponent} from './phonology-query-renderer/phonology-query-renderer.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {SearchToolbarComponent} from './search-toolbar/search-toolbar.component';
import {SidenavContentComponent} from './sidenav-content/sidenav-content.component';
import {SimplificationToolComponent} from './simplification-tool/simplification-tool.component';
import {WordDetailsHeroComponent} from './word-details-hero/word-details-hero.component';
import {WordDetailsComponent} from './word-details/word-details.component';
import {YngdiengBackendService} from './yngdieng-backend.service';
import {YngdiengTitleService} from './yngdieng-title.service';
import {YngpingHelpDialogComponent} from './yngping-help-dialog/yngping-help-dialog.component';
import {ContribExplanationComponent} from './contrib-explanation/contrib-explanation.component';
import {HistoricalDetailsComponent} from './historical-details/historical-details.component';
import {SearchV2ResultComponent} from './search-v2-result/search-v2-result.component';
import {WordCardComponent} from './word-card/word-card.component';
import {RichtextFlattenPipe} from './richtext-flatten.pipe';
import {NoResultsCardComponent} from './no-results-card/no-results-card.component';
import {EndOfResultsCardComponent} from './end-of-results-card/end-of-results-card.component';
import {GenericMessageCardComponent} from './generic-message-card/generic-message-card.component';
import {LoadingCardComponent} from './loading-card/loading-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    PhonologyComposerComponent,
    PhonologyQueryRendererComponent,
    HomeComponent,
    MonoHanziResultComponent,
    FengResultComponent,
    DetailsFengComponent,
    SearchToolbarComponent,
    AdvancedSearchLandingComponent,
    DetailsMonoHanziComponent,
    SidenavContentComponent,
    HelpComponent,
    CommonToolbarComponent,
    DebugInfoComponent,
    YngpingHelpDialogComponent,
    SimplificationToolComponent,
    AudioPlayerComponent,
    WordDetailsComponent,
    WordDetailsHeroComponent,
    FengExplanationComponent,
    ContribExplanationComponent,
    HistoricalDetailsComponent,
    SearchV2ResultComponent,
    WordCardComponent,
    RichtextFlattenPipe,
    NoResultsCardComponent,
    EndOfResultsCardComponent,
    GenericMessageCardComponent,
    LoadingCardComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [YngpingHelpDialogComponent],
  providers: [
    {provide: YNGDIENG_ENVIRONMENT, useValue: getYngdiengEnvironment()},
    YngdiengBackendService,
    YngdiengTitleService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

declare const _yngdieng_environment: string;

function getYngdiengEnvironment() {
  switch (_yngdieng_environment) {
    case 'dev':
      return YngdiengDevEnvironment;
    case 'staging':
      return YngdiengStagingEnvironment;
    case 'prod':
      return YngdiengProdEnvironment;
  }
}
