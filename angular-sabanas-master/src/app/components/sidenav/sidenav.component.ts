import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { SidenavMenuService } from '../../services/sidenav-menu.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  public selected_item = 0;
  public sidenavWidth = 4;


  constructor(private breakpointObserver: BreakpointObserver, public sidenavMenuService: SidenavMenuService,
    private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        switch (routerEvent.url) {
          case '/':
          case '/home':
            this.selected_item = 0;
            break;
          case '/home/monitoring':
          case '/home/sabanas':
            this.selected_item = 1;
            break;
          case '/home/userconfig':
            this.selected_item = 2;
            break;
          default:
            break;
        }
      }
    });
  }

  ngOnInit() {
  }

  public setSelectedItem(selected_item) {
    this.selected_item = selected_item;
  }

  increase() {
    this.sidenavWidth = 15;
  }

  decrease() {
    this.sidenavWidth = 4;
  }

  ngOnDestroy() {

  }


}
