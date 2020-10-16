import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';

import {MaterialModule} from '../../shared/material/material.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SidenavContentComponent} from './sidenav-content/sidenav-content.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [HomeComponent, AppComponent, SidenavContentComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
