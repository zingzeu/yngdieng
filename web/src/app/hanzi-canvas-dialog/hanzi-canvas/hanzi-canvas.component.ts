import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-hanzi-canvas',
  templateUrl: './hanzi-canvas.component.html',
  styleUrls: ['./hanzi-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HanziCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('hanziCanvas') hanziCanvas: ElementRef;
  @Input('hanzi') hanzi: string;
  isPending = true;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.isPending = false;
      let canvas = this.hanziCanvas.nativeElement;
      let ctx = canvas.getContext('2d');
      ctx.font = '44px "Noto Sans SC","Noto Sans TC","Ext-0","Ext-1",serif';
      ctx.fillText(this.hanzi, 2, 40);
    }, 2000);
  }
}
