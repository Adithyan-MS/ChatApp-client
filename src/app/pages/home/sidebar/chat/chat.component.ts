import { Component,Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { userChats } from '../../../../models/data-types';
import { AppService } from '../../../../services/app.service';
import { NewMessagesService } from '../../../../services/new-messages.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit,OnChanges{

  @Input() chat:userChats
  @Input() currentUserId:number
  @Input() clickedIndex?:number
  @Input() index:number
  profilePic:string|null
  lastMessageTime:string|null
  messageDateString:string
  isCurrentUserSender:boolean
  newMessageCount:number

  constructor(private appService: AppService,private newMessageService: NewMessagesService){}
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit()
  }

  ngOnInit(): void { 

    if(this.chat.latest_message_id){      
      if(this.newMessageService.getLatestMessage(this.chat.type,this.chat.id)){
        if((this.newMessageService.getLatestMessage(this.chat.type,this.chat.id).latest_message_id) != (this.chat.latest_message_id)){
          this.newMessageService.handleMessageReceived(this.chat.type,this.chat.id)
          this.newMessageService.changeLatestMessage(this.chat.type,this.chat.id,this.chat.latest_message_id)          
        }
      }else{
        this.newMessageService.setLatestMessage(this.chat.type,this.chat.id,this.chat.latest_message_id)
      }
      this.newMessageCount = this.newMessageService.getNewMessageCount(this.chat.type,this.chat.id) 
    }

    if(this.chat.latest_message_sender_id === this.currentUserId)
      this.isCurrentUserSender = true
    else
      this.isCurrentUserSender = false
    if(this.chat.max_modified_at){
      let dateToday = new Date().toDateString();
      let longDateYesterday = new Date();
      longDateYesterday.setDate(new Date().getDate() - 1);
      let dateYesterday = longDateYesterday.toDateString();
      let today = dateToday.slice(0, dateToday.length - 5);
      let yesterday = dateYesterday.slice(0, dateToday.length - 5);

      const wholeDate = new Date(
        this.chat.max_modified_at
      ).toDateString();

      this.messageDateString = wholeDate.slice(0, wholeDate.length - 5);

      if (
        new Date(this.chat.max_modified_at).getFullYear() ===
        new Date().getFullYear()
      ) {
        if (this.messageDateString === today) {
          this.lastMessageTime = this.appService.HHMMFormatter(this.chat.max_modified_at);
        } else if (this.messageDateString === yesterday) {
          this.lastMessageTime = "Yesterday";
        } else {
          this.lastMessageTime = this.appService.extractDate(this.chat.max_modified_at)
        }
      } else {
        this.lastMessageTime = this.appService.extractDate(this.chat.max_modified_at);
      }   
    }else{
      this.lastMessageTime = null
    }
    if(this.chat.type=="user"){
      this.profilePic = this.chat.profile_pic ? this.appService.getImageUrl(`user_${this.chat.id}`,this.chat.profile_pic) : environment.USER_IMAGE
    }else{
      this.profilePic = this.chat.profile_pic ? this.appService.getImageUrl(`room_${this.chat.id}`,this.chat.profile_pic) : environment.ROOM_IMAGE
    }



  }

}