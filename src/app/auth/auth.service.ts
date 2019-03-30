import { Injectable } from '@angular/core';
// import { JwtHelper} from 'angular2-jwt';
import { UserCredentials } from '../classes/user-credentials';
import { HttpClient } from '@angular/common/http';
import { URL_ROOT } from '../url-root';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '../services/jwt-helper.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable()
export class AuthService {

  url_root = URL_ROOT;
  readonly API_AUTH_TOKEN = '/api-token-auth/';
  readonly API_REFRESH_TOKEN = '/api-token-refresh/';


  // Los errores recibidos de los intentos de login
  public errors: any = [];

  constructor(public jwtHelper: JwtHelperService, private http: HttpClient, private router: Router) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return false;
    }
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  public logIn(user: UserCredentials) {
    this.http.post(this.url_root + this.API_AUTH_TOKEN, JSON.stringify(user)).subscribe(
      data => {
        console.log(data);
        localStorage.setItem('jwt', data['token']);
        this.router.navigate(['']);
      },
      err => {
        console.log('error login');
        console.log(err);
        this.errors = err['error'];
      }
    );
  }

  public refreshToken(): Observable<string> {
    const token = localStorage.getItem('jwt');
    return this.http.post(this.url_root + this.API_REFRESH_TOKEN, JSON.stringify({ token: token }))
    .pipe(map(
      response => {
            console.log('refresh successful!!!');
            localStorage.setItem('jwt', response['token']);
            return response['token'];
          }
    ));
    // .map(
    //   response => {
    //     console.log('refresh successful!!!');
    //     localStorage.setItem('jwt', response['token']);
    //     return response['token'];
    //   }
    // );
  }

  public removeToken() {
    localStorage.removeItem('jwt');
  }

  getToken(): string {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return null;
    }
    return token;
  }

}
