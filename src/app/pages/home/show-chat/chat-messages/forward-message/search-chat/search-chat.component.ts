import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../../../../services/app.service';
import { environment } from '../../../../../../../environments/environment.development';

@Component({
  selector: 'app-search-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-chat.component.html',
  styleUrl: './search-chat.component.scss'
})
export class SearchChatComponent implements OnInit{

  @Input() chat:any
  @Output() eventEmitter = new EventEmitter<any>()
  userPic:string

  constructor(private appService:AppService){}

  ngOnInit(): void {
    if(this.chat.profile_pic){
      this.userPic = this.appService.getImageUrl(this.chat.profile_pic);
    }else{
      this.userPic = environment.USER_IMAGE
    }
  }

  selectedChat(chat: any){
    this.eventEmitter.emit(chat)
  }


}
