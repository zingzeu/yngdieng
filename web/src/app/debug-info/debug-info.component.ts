import { Component, OnInit, OnDestroy } from '@angular/core';
import { YngdiengBackendService } from '../yngdieng-backend.service';
import { Subscription } from 'rxjs';
import { DebugInfo} from 'yngdieng/shared/services_pb';

@Component({
  selector: 'app-debug-info',
  templateUrl: './debug-info.component.html',
  styleUrls: ['./debug-info.component.scss']
})
export class DebugInfoComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  debugInfo: DebugInfo;

  constructor(private backendService: YngdiengBackendService) { }

  ngOnInit(): void {
    this.subscription = this.backendService.getDebugInfo().subscribe(response => {
      this.debugInfo = response;
    },
    error => {
      console.error(error);
    });
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

}
