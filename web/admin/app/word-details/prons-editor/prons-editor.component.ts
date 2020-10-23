import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormBuilder, FormGroup} from '@angular/forms';
import {YngdiengAdminService} from '../../yngdieng-admin.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {
  merge,
  of as observableOf,
  Subject,
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import {Pron} from '../../../../../yngdieng/admin/v1/service_pb';
interface PronEditorModel {
  name: string;
  form: FormGroup;
  subscription?: Subscription;
  savingData: boolean;
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
    'sc',
    'weight',
    'actions',
  ];
  data: PronEditorModel[] = [];
  isLoadingResults = false;
  remoteDataChanged = new BehaviorSubject({});
  @Input() word: string;
  @Input() prons: string[];

  constructor(
    private adminService: YngdiengAdminService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    merge(this.remoteDataChanged)
      .pipe(
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminService.batchGetProns$(this.word, this.prons);
        }),
        map(data => {
          this.isLoadingResults = false;
          return data.getPronsList().map(pron => {
            let rowModel = {
              name: pron.getName(),
              form: this.fb.group(
                {
                  pronunciation: this.fb.control(pron.getPronunciation()),
                  weight: this.fb.control(pron.getWeight()),
                  sandhiCategory: this.fb.control(pron.getSandhiCategory()),
                  variant: this.fb.control(pron.getVariant()),
                },
                {updateOn: 'blur'}
              ),
              savingData: false,
            };
            return rowModel;
          });
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.data.forEach(oldRow => {
          oldRow.subscription?.unsubscribe();
        });
        this.data = data;
        this.data.forEach(newRow => {
          newRow.form.valueChanges.subscribe(changes =>
            console.log('Changed:', changes)
          );
          newRow.subscription = newRow.form.valueChanges
            .pipe(
              switchMap(value => {
                console.log(value);
                // TODO: disable form while update request is in flight.
                newRow.savingData = true;
                let newPron = new Pron();
                newPron.setName(newRow.name);
                newPron.setPronunciation(
                  newRow.form.get('pronunciation').value
                );
                newPron.setWeight(newRow.form.get('weight').value);
                newPron.setSandhiCategory(
                  newRow.form.get('sandhiCategory').value
                );
                newPron.setVariant(newRow.form.get('variant').value);
                return this.adminService.updatePron$(newPron, [
                  'pronunciation',
                  'weight',
                  'sandhi_category',
                  'variant',
                ]);
              }),
              map(result => {
                newRow.savingData = false;
                return result;
              }),
              catchError((err, o) => {
                console.error(err);
                newRow.savingData = false;
                return o;
              })
            )
            .subscribe();
        });
      });
  }

  newPron() {
    this.adminService.createPron(this.word, 'new').then(result => {
      console.log(result);
      this.prons.push(result.getName());
      this.remoteDataChanged.next({});
    });
  }

  delete(row: PronEditorModel) {
    if (window.confirm('确定要删除这条读音吗？')) {
      row.form.disable();
      this.adminService
        .deletePron(row.name)
        .then(() => this.remoteDataChanged.next({}))
        .catch(() => this.remoteDataChanged.next({}));
    }
  }
}
