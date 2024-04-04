import { Injectable } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  public stompClient:any;
  public msg = [];

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(frame:any) {
      
      that.stompClient.subscribe('/message', (message:any) => {
        if (message.body) {
          console.log(message.body);
          
          // that.msg.push(message.body);
        }
      });
    });
  }
  
  sendMessage(message:any) {
    this.stompClient.send('/app/chat' ,   {}, message);
  }
  
}
