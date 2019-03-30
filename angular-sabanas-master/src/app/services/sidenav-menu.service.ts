import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavMenuService {


  public sidenavMenuBehaviorSubject = new BehaviorSubject<boolean>(true);
  public isMenuActivatedObs = this.sidenavMenuBehaviorSubject.asObservable();

  constructor() { }

}
