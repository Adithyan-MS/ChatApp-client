import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
      const stompMessage = {
        userId:userId
      }
      that.stompClient.send('/app/activateUser',{},JSON.stringify(stompMessage))     
      that.stompClient.subscribe(`/user/${userId}/queue/messages`, (message:any) => {
        if (message.body) {
          this.newMessageSubject.next(message.body)
        }
      });
      that.stompClient.subscribe(`/topic/news`, (message:any) => {
        // if (message.body) {
          // this.newMessageSubject.next(message.body)
          console.log("new");    
        // }
      });
    });
  }
  
  sendMessage(message:string) {
    this.stompClient.send('/app/chat' ,{}, message);
  }
}
