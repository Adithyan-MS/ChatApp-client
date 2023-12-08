import { Component,Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { userChats } from '../../../../models/data-types';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{

  @Input() chat:userChats
  profilePic:string|null
  lastMessageTime:string|null

  constructor(private appService: AppService){}

  ngOnInit(): void {

    if(this.chat.max_modified_at){
      this.lastMessageTime = this.appService.HHMMFormatter(this.chat.max_modified_at);    
    }else{
      this.lastMessageTime = null
    }
    if(this.chat.type=="user"){
      if (this.chat.profile_pic!=null) {
        this.profilePic=this.appService.getImageUrl(this.chat.profile_pic,this.chat.type);
      }else{
        this.profilePic = environment.USER_IMAGE
      }
    }else{
      if (this.chat.profile_pic!=null) {
        this.profilePic=this.appService.getImageUrl(this.chat.profile_pic,this.chat.type);
      }else{
        this.profilePic = environment.ROOM_IMAGE
      }
    }



  }

}