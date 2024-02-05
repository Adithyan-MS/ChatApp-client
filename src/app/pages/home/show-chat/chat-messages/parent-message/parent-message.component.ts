import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { VideoProcessingService } from '../../../../../services/video-processing.service';

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

  constructor(private appService:AppService,private videoService: VideoProcessingService){}
  
  ngOnInit(): void {
    if(typeof localStorage != "undefined"){
      this.user=localStorage.getItem("user")
      if(this.user)
        this.currentUserId=JSON.parse(this.user).id
      if(this.message.type == "image")
        this.imageParentUrl  = this.appService.getMessageImageUrl(`user_${this.message.sender_id}`,this.message.content)
      else if(this.message.type == "video"){
        this.videoService.generatePoster(this.appService.getMessageVideoUrl(`user_${this.message.sender_id}`,this.message.content),0.5)
          .then((thumbUrl) =>this.imageParentUrl = thumbUrl)
          .catch((error) =>console.error("Error generating thumbnail:", error));
      }
    }
  }
  close(){
    this.closeEvent.emit("close")
  }
}
