import { Component,EventEmitter,Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant, Room, User, userChats } from '../../../../models/data-types';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';
import { AppService } from '../../../../services/app.service';
import { ParticipantComponent } from './participant/participant.component';
import { CommonGroupComponent } from './common-group/common-group.component';

@Component({
  selector: 'app-chat-profile',
  standalone: true,
  imports: [CommonModule,ParticipantComponent,CommonGroupComponent],
  templateUrl: './chat-profile.component.html',
  styleUrl: './chat-profile.component.scss'
})
export class ChatProfileComponent implements OnInit{

  @Input()currentChat:userChats
  @Output() eventEmitter = new EventEmitter<string>()

  chatDetails:User|Room|any
  chatPicture:string|null
  createdAt:string
  members:Participant[]
  pastMembers:Participant[]|null=null
  userCommonRooms:Room[]

  constructor(private api:ApiService,private appService : AppService){}

  ngOnInit(): void {
    if(this.currentChat.type==="user"){
      this.api.getReturn(`${environment.BASE_API_URL}/user/${this.currentChat.name}`).subscribe((data:User)=>{
        this.chatDetails=data
        if(this.chatDetails.profilePic!=null){
          this.chatPicture = this.appService.getImageUrl(this.chatDetails.profilePic,this.currentChat.type)
        }else{
          this.chatPicture = environment.USER_IMAGE
        }
        this.createdAt = this.appService.DMonthYFormatter(this.chatDetails.createdAt)
      },(error)=>{
        console.log(error);        
      })
      this.api.getReturn(`${environment.BASE_API_URL}/user/${this.currentChat.name}/commonRooms`).subscribe((data:Room[])=>{
        this.userCommonRooms=data        
      },(error)=>{
        console.log(error);        
      })
    }else{
      this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.name}`).subscribe((data:Room)=>{
        this.chatDetails=data
        if(this.chatDetails.room_pic){
          this.chatPicture=this.appService.getImageUrl(this.chatDetails.room_pic,this.currentChat.type)
        }else{
          this.chatPicture= environment.ROOM_IMAGE
        }
        this.createdAt = this.appService.DMonthYFormatter(this.chatDetails.createdAt)
      },(error)=>{
        console.log(error);        
      })
      this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/participants`).subscribe((data: Participant[])=>{
        this.members = data
      },(error)=>{
        console.log(error);        
      })
      this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/pastParticipants`).subscribe((data: Participant[])=>{
        this.pastMembers = data
      },(error)=>{
        console.log(error);        
      })
    }
  }

  backToChat(){
    this.eventEmitter.emit("chat")
  }
    

}
