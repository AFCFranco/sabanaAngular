import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/websocket.service';
import { UserData } from '../../classes/user-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public wsMessagesSubscription: Subscription;

  constructor(private userService: UserService, public wsService: WebSocketService) { }

  ngOnInit() {
    this.obtainUser();
  }

  private obtainUser() {
    this.userService
      .obtenerUsuario()
      .subscribe((res: UserData[]) => {
        this.obtainSubscriptions();
        if (res[0] !== undefined) {
          this.wsService.userSoundBehaviorSubject.next(res[0].sound);
        }
      });
  }

  private obtainSubscriptions() {
    this.wsMessagesSubscription = this.wsService
      .connect()
      .subscribe(msg => {});
  }

  ngOnDestroy() {
    this.wsMessagesSubscription.unsubscribe();
  }

}
