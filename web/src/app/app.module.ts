import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatCardModule} from '@angular/material/card'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PhonologyComposerComponent } from './phonology-composer/phonology-composer.component';
import { PhonologyQueryRendererComponent } from './phonology-query-renderer/phonology-query-renderer.component';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    PhonologyComposerComponent,
    PhonologyQueryRendererComponent,
    SearchLandingComponent,
    HomeComponent
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
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
