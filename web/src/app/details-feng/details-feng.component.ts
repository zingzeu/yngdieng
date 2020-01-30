import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetFengDocumentRequest } from 'yngdieng/shared/services_pb';
import { YngdiengServiceClient } from 'yngdieng/shared/services_pb_service';
import { FengDocument } from 'yngdieng/shared/documents_pb';
import { YngdiengBackendService } from '../yngdieng-backend.service';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss']
})
export class DetailsFengComponent implements OnInit, OnDestroy {
 

  isBusy: boolean = false;
  hasError: boolean = false;
  fengDoc: FengDocument;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private location:Location,
    private backendService: YngdiengBackendService
  ) { }

  ngOnInit() {
    this.isBusy = true;

    this.subscription = this.route.paramMap.pipe(
      map(paramMap => paramMap.get("id")),
      switchMap(docId => this.backendService.getFengDocument(docId))
    ).subscribe((response) => {
      this.isBusy = false;
      this.hasError = false;
      this.fengDoc = response;
    }, (err) => {
      this.isBusy = false;
      this.hasError = true;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBackClicked() {
    this.location.back();
  }

}
