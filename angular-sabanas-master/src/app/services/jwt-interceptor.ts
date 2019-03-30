import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { flatMap, catchError, tap } from 'rxjs/operators';
import { URL_ROOT } from '../url-root';


// import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  url_root = URL_ROOT;
  readonly API_AUTH_TOKEN = '/api-token-auth/';

  public token: string;

  constructor(private router: Router, private authService: AuthService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Se obtiene el token almacenado en los cookies
    this.token = localStorage.getItem('jwt');
    let headers;
    if (request.url === (this.url_root + this.API_AUTH_TOKEN)) {
      headers = request.headers.set('Content-Type', 'application/json');
      // // console.log('entró2');
    } else {
      headers = request.headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${this.token}`);
    }
    const authReq = request.clone(
      {
        headers: headers
      }
    );

    return next.handle(authReq)
      .pipe(
        catchError(http_event => {
          if (http_event instanceof HttpErrorResponse) {
            if (http_event.status === 401) {
              this.authService.removeToken();
              this.router.navigate(['login']);
            }
            // console.log('entro aqui');
            if (http_event.status === 419) {
              return this.authService.refreshToken()
                .pipe(
                  flatMap(t => {
                    this.token = localStorage.getItem('jwt');
                    const headersN = request.headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${this.token}`);
                    const authReqN = request.clone(
                      {
                        headers: headersN
                      }
                    );
                    return next.handle(authReqN);
                  }));
            }
            // console.log('entró aqui también');
            // return next.handle(http_event);
          }
          return throwError(http_event);

        }
        )
      );
  }

}
