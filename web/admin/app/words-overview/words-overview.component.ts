import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {YngdiengAdminService} from '../yngdieng-admin.service';
import {merge, of as observableOf} from 'rxjs';
import {startWith, switchMap, map, catchError} from 'rxjs/operators';

export interface Word {
  name: string;
  hanzi: string;
  mandarinWords: string;
  gloss: string;
}

@Component({
  selector: 'app-words-overview',
  templateUrl: './words-overview.component.html',
  styleUrls: ['./words-overview.component.scss'],
})
export class WordsOverviewComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'hanzi',
    'gloss',
    'mandarinWords',
    'actions',
  ];
  data: Word[] = [];
  isLoadingResults = false;
  resultsLength = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private adminService: YngdiengAdminService) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminService.listWords$(
            this.paginator.pageIndex * this.paginator.pageSize,
            this.paginator.pageSize
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.getTotalSize();
          return data.getWordsList().map(w => {
            return {
              name: removeWordPrefix(w.getName()),
              hanzi: w.getHanzi(),
              mandarinWords: w.getMandarinWordsList().join(', '),
              gloss: w.getGloss(),
            };
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));
  }
}

function removeWordPrefix(resourceName: string) {
  if (resourceName.startsWith('words/')) {
    return resourceName.substr('words/'.length);
  }
  return resourceName;
}
