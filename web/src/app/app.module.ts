import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PhonologyComposerComponent } from './phonology-composer/phonology-composer.component';
import { PhonologyQueryRendererComponent } from './phonology-query-renderer/phonology-query-renderer.component';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleCharResultComponent } from './single-char-result/single-char-result.component';
import { FengResultComponent } from './feng-result/feng-result.component';
import { YNGDIENG_ENVIRONMENT } from '../environments/environment';
import { YngdiengDevEnvironment } from '../environments/environment.dev';
import { YngdiengStagingEnvironment } from '../environments/environment.staging';
import { YngdiengProdEnvironment } from '../environments/environment.prod';
import { DetailsFengComponent } from './details-feng/details-feng.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    PhonologyComposerComponent,
    PhonologyQueryRendererComponent,
    SearchLandingComponent,
    HomeComponent,
    SingleCharResultComponent,
    FengResultComponent,
    DetailsFengComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: YNGDIENG_ENVIRONMENT, useValue: getYngdiengEnvironment() }],
  bootstrap: [AppComponent]
})
export class AppModule { }

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