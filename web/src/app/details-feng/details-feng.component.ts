import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IYngdiengEnvironment, YNGDIENG_ENVIRONMENT } from '../../environments/environment';
import { GetFengDocumentRequest } from 'yngdieng/shared/services_pb';
import { YngdiengServiceClient } from 'yngdieng/shared/services_pb_service';
import { FengDocument } from 'yngdieng/shared/documents_pb';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss']
})
export class DetailsFengComponent implements OnInit {

  isBusy: boolean = false;
  fengDoc: FengDocument;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location:Location,
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment
    ) { }

  ngOnInit() {
    var fengDocId = this.route.snapshot.paramMap.get("id");

    this.isBusy = true;
    try {
      var request = new GetFengDocumentRequest();
      request.setId(fengDocId);
      let client = new YngdiengServiceClient(this.environment.serverUrl);
      client.getFengDocument(request, (err, response)=> {
        this.isBusy = false;
        this.fengDoc = response;
      });
    } catch (e) {
      this.isBusy = false;
    }
  }

  onBackClicked() {
    this.location.back();
  }

}
