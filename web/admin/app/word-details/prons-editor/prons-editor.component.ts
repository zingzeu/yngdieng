import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {YngdiengAdminService} from '../../yngdieng-admin.service';

interface PronEditorModel {
  pronunciation: FormControl;
}

@Component({
  selector: 'app-prons-editor',
  templateUrl: './prons-editor.component.html',
  styleUrls: ['./prons-editor.component.scss'],
})
export class PronsEditorComponent implements OnInit {
  displayedColumns: string[] = ['pronunciation', 'actions'];
  data: PronEditorModel[] = [];
  isLoadingResults = false;
  @Input() word: string;

  constructor(private adminService: YngdiengAdminService) {}

  ngOnInit(): void {}
}
