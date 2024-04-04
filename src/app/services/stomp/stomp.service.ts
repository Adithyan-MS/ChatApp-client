import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class StompService {

  stompClient =  Stomp.over(function(){
    return new SockJS(`http://localhost:8080/ws`, null, {transports: ["xhr-streaming", "xhr-polling"]});
  });

  constructor() { }

  subscibe(topic: string, callback : any) : void{
    const connected : boolean = this.stompClient.connected
    if(connected){
      this.subscibeToTopic(topic, callback)
      return
    }

    this.stompClient.connect({},() : any=>{
      this.subscibeToTopic(topic, callback)
    })
  }

  subscibeToTopic(topic : string, callback : any) : void {
    this.stompClient.subscribe(topic,() => {
      callback()
    })
  }
}
