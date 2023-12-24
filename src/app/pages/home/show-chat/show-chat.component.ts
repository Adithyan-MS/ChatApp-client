import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import {  userChats } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { AppService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { ChatProfileComponent } from './chat-profile/chat-profile.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { environment } from '../../../../environments/environment.development';

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
  user:string|null
  userId:number
  otherResponse:string|null = "Start a new chat."
  isCurrentUserPastParticipant:boolean
  
  constructor(private dataService:DataService,private api: ApiService,private appService: AppService,private router:Router){}

  ngAfterViewInit(): void {
  }
  
  ngOnInit(): void { 
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res.view==="chat"){
        if(res.data.type==="room"){
          if (typeof localStorage !== 'undefined' && localStorage.getItem("user")) {
            this.user = localStorage.getItem("user");
            if(this.user){
              this.userId = JSON.parse(this.user).id;
              this.api.getReturn(`${environment.BASE_API_URL}/room/${res.data.id}/isParticipant/${this.userId}`).subscribe((data:boolean)=>{
                if (data) {
                  this.showWhat="chat"
                  this.currentChat = res.data;
                  this.isCurrentUserPastParticipant=false
                } else {
                  this.showWhat="chat"
                  this.currentChat = res.data;
                  this.isCurrentUserPastParticipant=true
                }
              },(error)=>{
                this.showWhat="other"
                this.otherResponse = "Oops..., Something went wrong."
              })
            }
          }
        }else{
          this.showWhat="chat"       
          this.currentChat = res.data;
          this.isCurrentUserPastParticipant=false
        }
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
      this.showWhat = "other"
    }
  }
  onExitSuccess(value:any){
    this.ngOnInit()
  }
}
