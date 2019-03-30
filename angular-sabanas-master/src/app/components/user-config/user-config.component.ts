import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UpdateCredentials } from '../../classes/update-credentials';
import { UserData } from '../../classes/user-data';
import { WebSocketService } from '../../services/websocket.service';
import { MatSlideToggleChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { useAnimation } from '@angular/animations';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css']
})
export class UserConfigComponent implements OnInit, OnDestroy {

  public passwords: UpdateCredentials;
  success = false;

  hideCurrent = true;

  hideNew = true;

  user: UserData;

  userSoundSubscription: Subscription;

  constructor(public userService: UserService, private wsService: WebSocketService) { }

  ngOnInit() {
    this.passwords = {
      id: 0,
      cur_password: '',
      new_password: ''
    };
    this.userService
      .obtenerUsuario()
      .subscribe((msg: UserData[]) => {
        if (msg[0] !== undefined) {
          this.user = msg[0];
          this.obtainSubscriptions();
        }
      });
  }

  private obtainSubscriptions() {
    this.userSoundSubscription = this.wsService.userSoundObs
      .subscribe(msg => {
        this.user.sound = msg;
      });
  }

  updatePassword() {
    if (confirm('¿Desea realmente cambiar la contraseña?')) {
      this.userService.updatePassword(this.passwords).then(data => {
        // this.router.navigate(['home']);
        this.passwords.cur_password = '';
        this.passwords.new_password = '';
        this.success = true;
      }).catch(err => {
        console.log(err.error);
      });
    }
  }

  onChange(event: MatSlideToggleChange) {
    // console.log(event.checked);
    this.wsService.send({
      'msg_type': 'request',
      'request': 'user_sound',
      'details': {
        'user': this.user.id,
        'sound': event.checked
      }
    });
  }

  ngOnDestroy() {
    this.userService.errors = null;
    if (this.userSoundSubscription !== undefined) {
      this.userSoundSubscription.unsubscribe();
    }
  }

}
