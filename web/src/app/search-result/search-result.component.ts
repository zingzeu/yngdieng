import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hanzi } from 'yngdieng/shared/documents_pb';
// import SearchRequest = yngdieng.SearchRequest;
// import SearchResponse = yngdieng.SearchResponse;
// import GetDocumentRequest = yngdieng.GetDocumentRequest;
// import GetDocumentResponse = yngdieng.GetDocumentResponse;
// import Query = yngdieng.Query;
import { SearchRequest } from 'yngdieng/shared/services_pb';
import { YngdiengServiceClient } from 'yngdieng/shared/services_pb_service';
import { getInitialString, getFinalString, getToneString, getInitialFromString, getToneFromString } from "@yngdieng/utils";
import { QueryParser } from '@yngdieng/query-parser';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  queryText: any;
  prettyQueryText: string;
  isBusy: boolean = false;
  results: Array<SearchResultItemViewModel> = [];
  isInvalidQuery: boolean = false;

  private queryParser = new QueryParser();

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // this.hero$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     this.service.getHero(params.get('id'))
    //   })
    // );

    console.log(this.route);
    this.queryText = this.route.snapshot.paramMap.get("query");
    this.prettyQueryText = this.getPrettyText(this.queryText);

    // Parse query
    let query = this.queryParser.parse(this.queryText);
    if (query == null) {
      this.isInvalidQuery = true;
      return;
    }

    // Fetch results
    var request = new SearchRequest();
    request.setQuery(query);
    let client = new YngdiengServiceClient('http://localhost:8080');
    this.isBusy = true;
    client.getSearch(request, (err, response) => {
      this.isBusy = false;
      if (response == null) {
        this.results = [];
        return;
      }
      this.results = response.getDocumentsList()
        .map(d => ({
          hanziCanonical: getHanziString(d.getHanziCanonical()),
          hanziAlternatives: d.getHanziAlternativesList().map(getHanziString),
          buc: d.getBuc(),
          initial: getInitialString(d.getInitial()),
          final: getFinalString(d.getFinal()),
          tone: getToneString(d.getTone()),
          source: d.getDfdId() > 0 ? "DFD " + d.getDfd().getPageNumber() + " 页"
            : "戚林"
        } as SearchResultItemViewModel));
    });
  }

  onBackClicked() {
    this.router.navigate(["/search"])
  }

  private getPrettyText(s: string): string {
    return s.replace("i:", "声母:").replace("f:", "韵母:").replace("t:", "声调:")
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

function getHanziString(h: Hanzi): string {
  if (h.hasRegular()) {
    return h.getRegular();
  }
  return h.getIds();
}