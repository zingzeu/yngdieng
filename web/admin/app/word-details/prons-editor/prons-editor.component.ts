import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {YngdiengAdminService} from '../../yngdieng-admin.service';
import {catchError, map} from 'rxjs/operators';
import {merge, of as observableOf} from 'rxjs';
interface PronEditorModel {
  name: string;
  pronunciation: FormControl;
  weight: FormControl;
  sandhiCategory: FormControl;
  variant: FormControl;
}

@Component({
  selector: 'app-prons-editor',
  templateUrl: './prons-editor.component.html',
  styleUrls: ['./prons-editor.component.scss'],
})
export class PronsEditorComponent implements OnInit {
  displayedColumns: string[] = [
    'pronunciation',
    'variant',
    'weight',
    'sc',
    'actions',
  ];
  data: PronEditorModel[] = [];
  isLoadingResults = false;
  @Input() word: string;
  @Input() prons: string[];

  constructor(private adminService: YngdiengAdminService) {}

  ngOnInit(): void {
    this.adminService
      .batchGetProns$(this.word, this.prons)
      .pipe(
        map(data => {
          return data.getPronsList().map(pron => ({
            name: pron.getName(),
            pronunciation: new FormControl(pron.getPronunciation()),
            weight: new FormControl(pron.getWeight()),
            sandhiCategory: new FormControl(pron.getSandhiCategory()),
            variant: new FormControl(pron.getVariant()),
          }));
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.data = data;
      });
  }
}
