import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import {  userChats } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { AppService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { ChatProfileComponent } from './chat-profile/chat-profile.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

@Component({
  selector: 'app-show-chat',
  standalone: true,
  imports: [CommonModule,ChatProfileComponent,ChatMessagesComponent],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss'
})
export class ShowChatComponent implements OnInit,AfterViewInit{

  currentChat: userChats
  showWhat:string
  
  constructor(private dataService:DataService,private api: ApiService,private appService: AppService,private router:Router){}

  ngAfterViewInit(): void {
  }
  
  ngOnInit(): void { 
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res.view==="chat"){
        this.showWhat="chat"       
        this.currentChat = res.data;
      }
    })
    
  }
  viewProfile(event:any){
    this.showWhat = event
  }
  viewEvent($event:string){
    this.showWhat="chat"
  }
  onCancelEvent(value:any){
    if(this.currentChat){
      this.showWhat = value
    }else{
      this.showWhat = "startChat"
    }
  }
}
