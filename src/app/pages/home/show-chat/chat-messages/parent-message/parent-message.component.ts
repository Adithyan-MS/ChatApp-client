import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';

@Component({
  selector: 'app-parent-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parent-message.component.html',
  styleUrl: './parent-message.component.scss'
})
export class ParentMessageComponent implements OnInit{
  
  @Input() message:message
  @Output() closeEvent = new EventEmitter<any>()
  currentUserId:number
  user:string | null
  imageParentUrl:string

  constructor(private appService:AppService){}
  
  ngOnInit(): void {
    if(typeof localStorage != "undefined"){
      this.user=localStorage.getItem("user")
      if(this.user)
        this.currentUserId=JSON.parse(this.user).id
      if(this.message.type == "image")
        this.imageParentUrl  = this.appService.getMessageImageUrl(this.message.sender_name,this.message.content)
    }
  }
  close(){
    this.closeEvent.emit("close")
  }
}
