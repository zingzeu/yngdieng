import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hanzi } from 'yngdieng/shared/documents_pb';
import { SearchRequest, SearchResultRow } from 'yngdieng/shared/services_pb';
import { YngdiengServiceClient } from 'yngdieng/shared/services_pb_service';
import { getInitialString, getFinalString, getToneString } from "@yngdieng/utils";
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  queryText: any;
  shouldMerge: boolean;
  prettyQueryText: string;
  isBusy: boolean = false;
  results: Array<SearchResultItemViewModel> = [];
  isInvalidQuery: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    console.log(this.route);
    this.queryText = this.route.snapshot.paramMap.get("query");
    this.shouldMerge = this.queryText.indexOf("group:hanzi_phonology") > 0;
    this.prettyQueryText = this.getPrettyText(this.queryText);

    // Fetch results
    var request = new SearchRequest();
    request.setQuery(this.queryText);
    let client = new YngdiengServiceClient('http://localhost:8080');
    this.isBusy = true;
    client.getSearch(request, (err, response) => {
      this.isBusy = false;
      if (response == null) {
        this.results = [];
        return;
      }
      this.results = response.getResultsList()
        .map(resultRowToViewModel);
    });
  }

  onBackClicked() {
    this.router.navigate(["/search"])
  }

  onShouldMergeChanged(event: MatSlideToggleChange) {
    if (event.checked) {
      this.redirectTo(["/search", this.queryText + " group:hanzi_phonology"]);
    } else if (!event.checked) {
      this.redirectTo(["/search", this.queryText.replace("group:hanzi_phonology", "").trim()]);
    }
  }

  private redirectTo(commands: any[]) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(commands));
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
  ciklinSource: string | null;
  dfdSource: string | null;
}

function resultRowToViewModel(r: SearchResultRow): SearchResultItemViewModel {
  switch (r.getResultCase()) {
    case SearchResultRow.ResultCase.DOCUMENT:
      let d = r.getDocument();
      return {
        hanziCanonical: getHanziString(d.getHanziCanonical()),
        hanziAlternatives: d.getHanziAlternativesList().map(getHanziString),
        buc: d.getBuc(),
        initial: getInitialString(d.getInitial()),
        final: getFinalString(d.getFinal()),
        tone: getToneString(d.getTone()),
        ciklinSource: d.getDfdId() > 0 ? null : "戚林",
        dfdSource: d.getDfdId() > 0 ? "DFD " + d.getDfd().getPageNumber() + " 页" : null
      } as SearchResultItemViewModel;
    case SearchResultRow.ResultCase.AGGREGATED_DOCUMENT:
      let a = r.getAggregatedDocument();
      return {
        hanziCanonical: getHanziString(a.getHanziCanonical()),
        hanziAlternatives: a.getHanziAlternativesList().map(getHanziString),
        buc: a.getBuc(),
        initial: getInitialString(a.getInitial()),
        final: getFinalString(a.getFinal()),
        tone: getToneString(a.getTone()),
        ciklinSource: a.hasCiklinSource() ? "戚林" : null,
        dfdSource: a.hasDfdSource() ? "DFD " + a.getDfdSource().getPageNumber() + " 页" : null,
      }
    default:
      return null
  }
}

function getHanziString(h: Hanzi): string {
  if (h.hasRegular()) {
    return h.getRegular();
  }
  return h.getIds();
}