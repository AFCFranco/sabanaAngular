import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredentials } from '../../classes/user-credentials';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



  public user: UserCredentials = {
    username: '',
    password: ''
  };

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.user = {
        username: '',
        password: ''
      };
      this.router.navigate(['']);
    }
  }

  logIn() {
    this.authService.logIn(this.user);
  }

}

