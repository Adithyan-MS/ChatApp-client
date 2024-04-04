import { Injectable } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AppService } from '../app.service';
import { User } from '../../models/data-types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  public stompClient:any;
  public msg = [];
  user:any
  userId : any
  private newMessageSubject = new Subject<any>()
  newMessage$ = this.newMessageSubject.asObservable()

  constructor() {
    if(typeof localStorage != undefined){
      this.user = localStorage.getItem("user");
      this.userId = JSON.parse(this.user).id; 
    }
    this.initializeWebSocketConnection(this.userId);
  }

  initializeWebSocketConnection(userId:any) {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame:any) => {      
      that.stompClient.subscribe(`/user/${userId}/queue/messages`, (message:any) => {
        if (message.body) {
          this.newMessageSubject.next(message.body)
        }
      });
    });
  }
  
  sendMessage(message:string) {
    this.stompClient.send('/app/chat' ,{}, message);
  }
  
}
