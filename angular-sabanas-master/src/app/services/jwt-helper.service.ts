import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {


  public username: string;
  public token_expires: Date;


  constructor() { }

  isTokenExpired (token): boolean {
    const token_decoded = this.getTokenDecoded(token);
    this.username = this.getTokenUsername(token_decoded);
    this.token_expires = this.getTokenExpires(token_decoded);
    const today = new Date();
    if (this.token_expires <= today) {
      return true;
    }
    return false;
  }

  private getTokenDecoded(token) {
    const token_parts = token.split(/\./);
    return JSON.parse(window.atob(token_parts[1]));
  }

  private getTokenUsername(token_decoded) {
    return token_decoded.username;
  }

  private  getTokenExpires(token_decoded) {
    const token_expires = new Date(token_decoded.exp * 1000);
    return token_expires;
  }
}
