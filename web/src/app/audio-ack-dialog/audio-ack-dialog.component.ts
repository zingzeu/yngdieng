import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-audio-ack-dialog',
  templateUrl: './audio-ack-dialog.component.html',
  styleUrls: ['./audio-ack-dialog.component.scss'],
})
export class AudioAckDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AudioAckDialogComponent>) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
