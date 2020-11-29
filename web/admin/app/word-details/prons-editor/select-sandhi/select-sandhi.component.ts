import {Component, OnInit, Input} from '@angular/core';
import {SandhiCategory} from 'yngdieng/yngdieng/admin/v1/service_pb';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-select-sandhi',
  templateUrl: './select-sandhi.component.html',
  styleUrls: ['./select-sandhi.component.scss'],
})
export class SelectSandhiComponent implements OnInit {
  @Input() control: FormControl;
  options = [
    {
      value: SandhiCategory.SANDHI_CATEGORY_UNSPECIFIED,
      viewValue: '',
    },
    {
      value: SandhiCategory.SANDHI_CATEGORY_BENGZI,
      viewValue: '本字音',
    },
    {
      value: SandhiCategory.SANDHI_CATEGORY_SANDHI,
      viewValue: '连读音',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
