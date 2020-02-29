import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FengDocument} from 'yngdieng/shared/documents_pb';
import {GetFengDocumentRequest} from 'yngdieng/shared/services_pb';
import {YngdiengServiceClient} from 'yngdieng/shared/services_pb_service';

import {YngdiengBackendService} from '../yngdieng-backend.service';

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
      private location: Location,
      private backendService: YngdiengBackendService) {}

  ngOnInit() {
    this.isBusy = true;

    this.subscription = this.route.paramMap
                            .pipe(
                                map(paramMap => paramMap.get('id')),
                                switchMap(docId => this.backendService.getFengDocument(docId)))
                            .subscribe(
                                (response) => {
                                  this.isBusy = false;
                                  this.hasError = false;
                                  this.fengDoc = response;
                                },
                                (err) => {
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
