import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-hanzi-canvas-dialog',
  templateUrl: './hanzi-canvas-dialog.component.html',
  styleUrls: ['./hanzi-canvas-dialog.component.scss'],
})
export class HanziCanvasDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<HanziCanvasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {hanziSequence: string}
  ) {}
  get hanziList() {
    return getGlyphs(this.data.hanziSequence);
  }
  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

function getGlyphs(string) {
  var index = 0;
  var length = string.length;
  var output = [];
  for (; index < length - 1; ++index) {
    let charCode = string.charCodeAt(index);
    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      let charCodeNext = string.charCodeAt(index + 1);
      if (charCodeNext >= 0xdc00 && charCodeNext <= 0xdfff) {
        output.push(string.slice(index, index + 2));
        ++index;
        continue;
      }
    }
    output.push(string.charAt(index));
  }
  if (index < length) {
    output.push(string.charAt(index));
  }
  return output;
}
