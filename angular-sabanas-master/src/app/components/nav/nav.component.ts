import { Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SidenavMenuService } from '../../services/sidenav-menu.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {


  @Output() toggleSidenav = new EventEmitter<void>();

  private menuSubscription: Subscription;

  private isMenuActivated = true;

  constructor(public sidenavMenuService: SidenavMenuService, private authService: AuthService,
     private router: Router, public userService: UserService) { }

  ngOnInit() {
    this.menuSubscription = this.sidenavMenuService.isMenuActivatedObs.subscribe((resp: boolean) => {
      this.isMenuActivated = resp;
    });
  }

  customMenuToggle() {
    this.sidenavMenuService.sidenavMenuBehaviorSubject.next(!this.isMenuActivated);

  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
  }

  logout() {
    if (confirm('¿Desea realmente salir?')) {
      this.authService.removeToken();
      this.router.navigate(['login']);
    }
  }

}
