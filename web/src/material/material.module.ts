import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';

const matModules = [
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
  MatListModule,
  MatCheckboxModule
];

/**
 * A module for importing Angular Material components.
 */
@NgModule({imports: matModules, exports: matModules})
export class MaterialModule {
}
