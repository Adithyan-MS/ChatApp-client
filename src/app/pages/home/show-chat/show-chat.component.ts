import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { DataService } from '../../../services/data.service';
import { message, userChats } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.development';
import { error } from 'console';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-show-chat',
  standalone: true,
  imports: [CommonModule,MessageComponent],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss'
})
export class ShowChatComponent implements OnInit{
  
  currentChat: userChats
  currentChatPic: string|null
  name:string
  showChat:boolean
  messageList:message[]

  constructor(private dataService:DataService,private api: ApiService,private appService: AppService){}

  ngOnInit(): void {
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res){
        this.showChat=true       
        this.currentChat = res.chat;
        if (this.currentChat.profile_pic) {
          this.currentChatPic = this.appService.getImageUrl(this.currentChat.profile_pic,this.currentChat.type);
        }else{
          this.currentChatPic=null
        }
        if(this.currentChat.type="user"){
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
      }else{
        this.showChat=false
      }
    })
  }

}
