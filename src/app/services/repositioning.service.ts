import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { RepositioningData } from '../classes/repositioning-data';

@Injectable({
  providedIn: 'root'
})
export class RepositioningService {

  constructor(private wsService: WebSocketService) { }

  obtainRepositioning() {
    // return this.wsService.getRepositioning.subscribe( (msg: RepositioningData) => {
    //   return msg;
    // });
  }

}
