import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../classes/user-data';
import { HttpClient } from '@angular/common/http';
import { URL_ROOT } from '../url-root';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly USER_GET_PATH = '/api/monitoring/users';
  readonly USER_PUT_PATH = '/api/monitoring/users/';
  url_root = URL_ROOT;

  public userSubject = new BehaviorSubject<UserData>(null);
  public userObs = this.userSubject.asObservable();
  public errors: any = [];


  constructor( private httpClient: HttpClient ) { }

  obtenerUsuario() {
      return this.httpClient.get<UserData[]>(this.url_root + this.USER_GET_PATH)
      .pipe(
        map(res => {
          this.userSubject.next(<UserData>res['results'][0]);
          return <UserData[]>res['results'];
        })
      );
  }

  updatePassword(passwords) {
    return new Promise((resolve, reject) => {
      this.httpClient.put(this.url_root + this.USER_PUT_PATH +
        this.userSubject.getValue().id, JSON.stringify(passwords)).subscribe(
        data => {
          this.errors = [];
          resolve(data);
        },
        err => {
          this.errors = err['error'];
          reject(err);
        }
      );
    });
  }
}
