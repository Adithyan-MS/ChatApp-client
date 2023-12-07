import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { DataService } from '../../../services/data.service';
import { message, sendMessage, userChats } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.development';
import { AppService } from '../../../services/app.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatProfileComponent } from './chat-profile/chat-profile.component';

@Component({
  selector: 'app-show-chat',
  standalone: true,
  imports: [CommonModule,MessageComponent,ReactiveFormsModule,ChatProfileComponent],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss'
})
export class ShowChatComponent implements OnInit,OnDestroy{

  currentChat: userChats
  currentChatPic: string|null
  name:string
  shatWhat:string
  messageList:message[]
  messageForm:FormGroup
  showProfile:boolean
  
  constructor(private fb: FormBuilder,private dataService:DataService,private api: ApiService,private appService: AppService,private router:Router){}

  ngOnInit(): void {
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res){
        this.shatWhat="chat"       
        this.currentChat = res;
        if (this.currentChat.profile_pic) {
          this.currentChatPic = this.appService.getImageUrl(this.currentChat.profile_pic,this.currentChat.type);
        }else{
          this.currentChatPic=null
        }
        if(this.currentChat.type==="user"){
          this.api.getReturn(`${environment.BASE_API_URL}/message/user/${this.currentChat.id}`).subscribe((data:message[])=>{
            this.messageList=data
          },(error)=>{
            console.log(error);
          })
        }else{
          this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}`).subscribe((data:message[])=>{
            this.messageList=data           
          },(error)=>{
            console.log(error);
          })
        }
      }
    })
    this.messageForm = this.fb.group({
      content:['',[Validators.required]]
    })
  }

  ngOnDestroy(): void {
  }

  sendMessage(){

    const formValue = this.messageForm.getRawValue();
    const messageData: sendMessage={
      message:{
        content:formValue.content,
        parentMessage:null
      },
      receiver:{
        type:this.currentChat.type,
        id:this.currentChat.id
      }
    }    
    const headers = new HttpHeaders().set('ResponseType','text')
    this.api.postReturn(`${environment.BASE_API_URL}/message/sendMessage`,messageData,{headers}).subscribe((data)=>{
      this.messageForm.reset()
    },(error)=>{
      console.log(error);
    })
  }

  viewProfile(currentChat:userChats){
    this.shatWhat="profile"
  }


}
