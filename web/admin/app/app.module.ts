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
import {WordDetailsComponent} from './word-details/word-details.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {PronsEditorComponent} from './word-details/prons-editor/prons-editor.component';
import {SelectSandhiComponent} from './word-details/prons-editor/select-sandhi/select-sandhi.component';
import {SelectVariantComponent} from './word-details/prons-editor/select-variant/select-variant.component';
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    SidenavContentComponent,
    WordsOverviewComponent,
    WordDetailsComponent,
    PronsEditorComponent,
    SelectSandhiComponent,
    SelectVariantComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
