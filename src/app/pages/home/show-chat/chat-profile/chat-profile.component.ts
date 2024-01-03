import { Component,EventEmitter,Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant, Room, User, userChats } from '../../../../models/data-types';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';
import { AppService } from '../../../../services/app.service';
import { ParticipantComponent } from './participant/participant.component';
import { CommonGroupComponent } from './common-group/common-group.component';
import { ModalService } from '../../../../services/modal.service';
import { DataService } from '../../../../services/data.service';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-profile',
  standalone: true,
  imports: [CommonModule,ParticipantComponent,CommonGroupComponent],
  templateUrl: './chat-profile.component.html',
  styleUrl: './chat-profile.component.scss'
})
export class ChatProfileComponent implements OnInit{

  @Input()currentChat:userChats
  @Input()isCurrentUserPastParticipant:boolean
  @Output() eventEmitter = new EventEmitter<string>()
  @Output() exitSuccessEvent = new EventEmitter<string>()
  chatDetails:User|Room|any
  chatPicture:string
  createdAt:string
  members:Participant[]
  pastMembers:Participant[]|null=null
  userCommonRooms:Room[]
  isChatTypeUser:boolean
  isCurrentUserAdmin:boolean = false
  currentUser:string|null
  removeMemberList:number[]=[]
  isExitSuccess:boolean=true
  imageFile:File|null
  newFileName:string
  newUserDetails:User|any

  constructor(private api:ApiService,private route:ActivatedRoute,private appService : AppService,private modalService:ModalService, private viewContainerRef: ViewContainerRef, private dataService:DataService,private router:Router){}
  
  ngOnInit(): void {   
    this.dataService.notifyObservable$.subscribe((res)=>{
      if(res == "newMembersAdded"){
        this.getRoomParticipants()
        this.getRoomPastParticipants()
      }
    })
    if(typeof localStorage != "undefined"){
      this.currentUser = localStorage.getItem("user");
    } 
    if(this.currentChat.type==="user"){
      this.isChatTypeUser = true
      this.api.getReturn(`${environment.BASE_API_URL}/user/${this.currentChat.name}`).subscribe((data:User)=>{
        this.chatDetails=data
        if(this.chatDetails.profilePic!=null){
          this.chatPicture = this.appService.getImageUrl(this.chatDetails.name,this.chatDetails.profilePic)
        }else{
          this.chatPicture = environment.USER_IMAGE
        }
        this.createdAt = this.appService.DMonthYFormatter(this.chatDetails.createdAt)
      },(error)=>console.log(error))
      this.api.getReturn(`${environment.BASE_API_URL}/user/${this.currentChat.name}/commonRooms`).subscribe((data:Room[])=>{
        this.userCommonRooms=data        
      },(error)=>console.log(error))
    }else{
      this.isChatTypeUser = false
      this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.name}`).subscribe((data:Room)=>{
        this.chatDetails=data
        if(this.chatDetails.room_pic){
          this.chatPicture=this.appService.getImageUrl(this.chatDetails.name,this.chatDetails.room_pic)
        }else{
          this.chatPicture= environment.ROOM_IMAGE
        }
        this.createdAt = this.appService.DMonthYFormatter(this.chatDetails.createdAt)
      },(error)=>console.log(error))
      this.getRoomParticipants()
      this.getRoomPastParticipants()
      
    }
  }

  backToChat(){
    this.eventEmitter.emit("chat")
    this.router.navigate([`${this.currentChat.name}`], {relativeTo:this.route});
  }
    
  viewImage(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("viewImage",this.chatPicture)
  }

  showAddMembers(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("addMember",this.currentChat.id)
  }

  isAdmin(members: Participant[], currentUserId: number): boolean {
    const user = members.find(member => member.id === currentUserId);    
    return !!user && user.is_admin;
  }
  getRoomParticipants(){
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/participants`).subscribe((data: Participant[])=>{
      this.members = data
      if(this.currentUser!=null)
        this.isCurrentUserAdmin = this.isAdmin(this.members,JSON.parse(this.currentUser).id)
    },(error)=>console.log(error))
  }
  getRoomPastParticipants(){
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/pastParticipants`).subscribe((data: Participant[])=>{
      this.pastMembers = data
    },(error)=>console.log(error))
  }

  onRemoveEvent(event:number){
    this.removeMemberList.push(event)
    if(this.removeMemberList.length!=0){
      const reqBody = {
        members:this.removeMemberList
      }
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/removeMember`,reqBody,{headers}).subscribe((data)=>{
        this.getRoomParticipants()
        this.getRoomPastParticipants()
      },(error)=>console.log(error))
    }
  }
  
  onMakeRoomAdminEvent(value:number){
    const memberId = value
    if(memberId){
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/makeRoomAdmin/${memberId}`,null,{headers}).subscribe((data)=>{
        this.getRoomParticipants()
      },(error)=>console.log(error))
    }
  }
  
  onDismissAdminEvent(value:number){
    const memberId = value
    if(memberId){
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/dismissRoomAdmin/${memberId}`,null,{headers}).subscribe((data)=>{
        this.getRoomParticipants()
      },(error)=>console.log(error))
    }
  }
  
  onExitRoom(){
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/exitRoom`,null,{headers}).subscribe((data)=>{
      this.getRoomParticipants()
      this.getRoomPastParticipants()
      this.isExitSuccess=true
      this.router.navigate([`${this.currentChat.name}`], {relativeTo:this.route});
      this.exitSuccessEvent.emit("success")
    },(error)=>{
      this.isExitSuccess=false
         
    })
  }
  onFilechange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      let formParams = new FormData();
      formParams.append('file',this.imageFile);
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/image/upload/${this.chatDetails.id}`,formParams,{headers}).subscribe((data)=>{
        if(data){
          this.chatDetails.room_pic = this.appService.getImageUrl(this.chatDetails.name,data);
          this.ngOnInit()
        }
      },(error)=>console.log(error))
    }else{
    }
  }
  searchMessage(){
    this.backToChat()
    this.dataService.notifyOther("openSearch")
    this.router.navigate([`${this.currentChat.name}`], {relativeTo:this.route});
  }
  createRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("createRoom",this.chatDetails)
  }

}
