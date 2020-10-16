import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';

import {MaterialModule} from '../../shared/material/material.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SidenavContentComponent} from './sidenav-content/sidenav-content.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WordsOverviewComponent} from './words-overview/words-overview.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    SidenavContentComponent,
    WordsOverviewComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    MaterialModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatTableModule,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
