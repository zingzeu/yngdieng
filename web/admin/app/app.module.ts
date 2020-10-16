import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';

import {MaterialModule} from '../../shared/material/material.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [HomeComponent, AppComponent],
  imports: [AppRoutingModule, BrowserModule, CommonModule, MaterialModule],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
