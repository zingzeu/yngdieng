import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {SearchRequest, SearchResponse, GetDocumentRequest, GetDocumentResponse, Query} from '../yngdieng/services_pb';
import { YngdiengServiceClient } from '../yngdieng/services_grpc_web_pb';
import { getInitialString, getFinalString, getToneString, getInitialFromString, getToneFromString } from "../yngdieng/utils";
import { QueryParser } from '../yngdieng/query-parser';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.sass']
})
export class SearchResultComponent implements OnInit {
  
  queryText: any;
  results: any;

  constructor(
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.hero$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     this.service.getHero(params.get('id'))
    //   })
    // );

    console.log(this.route);
    this.queryText = this.route.snapshot.paramMap.get("query");

    var client = new YngdiengServiceClient('http://localhost:8080');

    var query = new Query();
    query.setHanziQuery(this.queryText);
    var request = new SearchRequest();
    request.setQuery(query);

    client.getSearch(request, {}, (err, response) => {
      this.results = response.getDocumentsList()
        .map(d => ({
            hanziCanonical: d.getHanziCanonical(),
            hanziAlternatives: d.getHanziAlternativesList(),
            buc: d.getBuc(),
            initial: getInitialString(d.getInitial()),
            final: getFinalString(d.getFinal()),
            tone: getToneString(d.getTone()),
            source: d.getDfdId() > 0 ? "DFD " + d.getDfd().getPageNumber() + " 页" 
              : "戚林"
        } as SearchResultItemViewModel));
    });

    console.log(getToneFromString("下去"));
    console.log(new QueryParser().parse("t:下去 i:柳"))
  }
}

interface SearchResultItemViewModel {
  hanziCanonical: string;
  hanziAlternatives: string[];
  buc: string;
  initial: string;
  final: string;
  tone: string;
  source: string;
}
