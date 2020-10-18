import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Variant} from '../../../../../../yngdieng/admin/v1/service_pb';

@Component({
  selector: 'app-select-variant',
  templateUrl: './select-variant.component.html',
  styleUrls: ['./select-variant.component.scss'],
})
export class SelectVariantComponent implements OnInit {
  @Input() formControl: FormControl;
  options = [
    {
      value: Variant.VARIANT_UNSPECIFIED,
      viewValue: '',
    },
    {
      value: Variant.VARIANT_FUZHOU_CITY,
      viewValue: '福州市区音',
    },
    {
      value: Variant.VARIANT_LIANJIANG,
      viewValue: '连江',
    },
    {
      value: Variant.VARIANT_CIKLING,
      viewValue: '戚林八音音系',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
