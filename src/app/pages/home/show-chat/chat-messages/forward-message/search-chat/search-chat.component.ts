import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../../../../services/app.service';
import { environment } from '../../../../../../../environments/environment.development';
import { chatSearch } from '../../../../../../models/data-types';

@Component({
  selector: 'app-search-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-chat.component.html',
  styleUrl: './search-chat.component.scss'
})
export class SearchChatComponent implements OnInit{

  @Input() chat:chatSearch
  @Output() eventEmitter = new EventEmitter<any>()
  chatPic:string

  constructor(private appService:AppService){}

  ngOnInit(): void {
    if(this.chat.type === "user"){
      this.chatPic = this.chat.profile_pic ? this.appService.getImageUrl(`user_${this.chat.id}`,this.chat.profile_pic) : environment.USER_IMAGE
    }else{
      this.chatPic = this.chat.profile_pic ? this.appService.getImageUrl(`room_${this.chat.id}`,this.chat.profile_pic) : environment.ROOM_IMAGE
    }
  }

  selectedChat(chat: any){
    this.eventEmitter.emit(chat)
  }


}
