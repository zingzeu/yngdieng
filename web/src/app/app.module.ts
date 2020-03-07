import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {YNGDIENG_ENVIRONMENT} from '../environments/environment';
import {YngdiengDevEnvironment} from '../environments/environment.dev';
import {YngdiengProdEnvironment} from '../environments/environment.prod';
import {YngdiengStagingEnvironment} from '../environments/environment.staging';

import {AdvancedSearchLandingComponent} from './advanced-search-landing/advanced-search-landing.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DetailsFengComponent} from './details-feng/details-feng.component';
import {DetailsMonoHanziComponent} from './details-mono-hanzi/details-mono-hanzi.component';
import {FengResultComponent} from './feng-result/feng-result.component';
import {HomeComponent} from './home/home.component';
import {PhonologyComposerComponent} from './phonology-composer/phonology-composer.component';
import {PhonologyQueryRendererComponent} from './phonology-query-renderer/phonology-query-renderer.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {SearchToolbarComponent} from './search-toolbar/search-toolbar.component';
import {SingleCharResultComponent} from './single-char-result/single-char-result.component';
import {YngdiengBackendService} from './yngdieng-backend.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    PhonologyComposerComponent,
    PhonologyQueryRendererComponent,
    HomeComponent,
    SingleCharResultComponent,
    FengResultComponent,
    DetailsFengComponent,
    SearchToolbarComponent,
    AdvancedSearchLandingComponent,
    DetailsMonoHanziComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:
      [{provide: YNGDIENG_ENVIRONMENT, useValue: getYngdiengEnvironment()}, YngdiengBackendService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

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