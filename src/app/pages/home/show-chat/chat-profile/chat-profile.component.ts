import { Component,ElementRef,EventEmitter,Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
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
import { ClickOutsideDirective } from '../../../../directives/clickOutside/click-outside.directive';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AnimationService } from '../../../../services/animation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-chat-profile',
  standalone: true,
  imports: [CommonModule,ParticipantComponent,ReactiveFormsModule,CommonGroupComponent,ClickOutsideDirective,PickerComponent],
  templateUrl: './chat-profile.component.html',
  styleUrl: './chat-profile.component.scss',
  animations:[AnimationService.prototype.getDropdownAnimation()]
})
export class ChatProfileComponent implements OnInit{

  @Input()currentChat:userChats
  @Input()isCurrentUserPastParticipant:boolean
  @Output() eventEmitter = new EventEmitter<string>()
  @Output() exitSuccessEvent = new EventEmitter<string>()
  @Output() deleteRoomSuccessEvent = new EventEmitter<string>()
  @ViewChild("bioEditField") bioEditField : ElementRef
  @ViewChild("bioEditSpan") bioEditSpan : ElementRef
  @ViewChild("nameEditField") nameEditField : ElementRef
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
  isBioEditOpened:boolean=false
  isNameEditOpened:boolean=false
  isEmojiOpened: boolean=false;
  bioEditForm:FormGroup
  nameEditForm:FormGroup
  maxNameContentLength=40
  maxDescContentLength=200
  alertOpenedOnce:boolean = false

  constructor(private api:ApiService,private fb:FormBuilder,private route:ActivatedRoute,private appService : AppService,private modalService:ModalService, private viewContainerRef: ViewContainerRef, private dataService:DataService,private router:Router){}
  
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
        this.chatPicture = this.chatDetails.profilePic ? this.appService.getImageUrl(`user_${this.chatDetails.id}`,this.chatDetails.profilePic) : environment.USER_IMAGE
        this.createdAt = this.appService.DMonthYFormatter(this.chatDetails.createdAt)
      },(error)=>console.log(error))
      this.api.getReturn(`${environment.BASE_API_URL}/user/${this.currentChat.name}/commonRooms`).subscribe((data:Room[])=>{
        this.userCommonRooms=data
      },(error)=>console.log(error))
    }else{
      this.isChatTypeUser = false
      this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}`).subscribe((data:Room)=>{
        this.chatDetails=data
        this.chatPicture = this.chatDetails.room_pic ? this.appService.getImageUrl(`room_${this.chatDetails.id}`,this.chatDetails.room_pic) : environment.ROOM_IMAGE
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
    this.modalService.addDynamicComponent("viewImage",null,this.chatPicture)
  }

  showAddMembers(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("addMember","Add Room Members",this.currentChat.id)
  }
  
  shareRoomCode(){
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/getRoomCode`,{headers}).subscribe((data)=>{
      this.modalService.setRootViewContainerRef(this.viewContainerRef)
      this.modalService.addDynamicComponent("alert","roomCode",data)
    },(error)=>{
      console.log(error);
    })
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
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent('confirmation','Remove participant',`Are you sure you want to remove participant from "${this.currentChat.name}" room?`).then((value)=>{
      if(value){
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
    }).catch((error)=>{
      console.log(error);
    });
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
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent('confirmation','Exit room',`Are you sure you want to exit "${this.currentChat.name}" room?`).then((value)=>{
      if(value){
        const headers = new HttpHeaders().set("ResponseType","text")
        this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/exitRoom`,null,{headers}).subscribe((data)=>{
          this.getRoomParticipants()
          this.getRoomPastParticipants()
          this.isExitSuccess=true
          this.router.navigate([`${this.currentChat.name}`], {relativeTo:this.route});
          this.exitSuccessEvent.emit("success")
        },(error)=>{
          this.isExitSuccess=false
          this.modalService.setRootViewContainerRef(this.viewContainerRef)
          this.modalService.addDynamicComponent('alert',null,`Can't Exit, You are the only Admin in "${this.currentChat.name}"!`)
        })
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  onFilechange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      let formParams = new FormData();
      formParams.append('file',this.imageFile);
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/image/upload/${this.chatDetails.id}`,formParams,{headers}).subscribe((data)=>{
        if(data){
          this.chatDetails.room_pic = this.appService.getImageUrl(`room_${this.chatDetails.id}`,data);
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
    this.modalService.addDynamicComponent("createRoom","Create Room",this.chatDetails)
  }

  deleteRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent('confirmation','Delete this room?',`Are you sure you want to delete "${this.currentChat.name}" room?`).then((value)=>{
      if(value){
        const headers = new HttpHeaders().set("ResponseType","text")
        this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/delete`,null,{headers}).subscribe((data)=>{
          if(data){
            console.log(data);
            this.dataService.notifyOther({
              view:"other",data:null  
            })
          }
        },(error)=>console.log(error))
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  openBioEdit(){
    this.bioEditForm = this.fb.group({
      description:[this.chatDetails.description,[Validators.required]]
    })
    this.isBioEditOpened = true
    setTimeout(()=>{
      this.bioEditSpan.nativeElement.innerText = this.chatDetails.description 
      this.bioEditSpan.nativeElement.focus()
      this.moveCursorToEnd() 
      this.onBioInput()
    })    
    this.isNameEditOpened = false
  }
  onBioInput(){
    let newValue = this.bioEditSpan.nativeElement.innerText;
    if (newValue.length > this.maxDescContentLength) {
      newValue = newValue.slice(0, this.maxDescContentLength);
      this.bioEditSpan.nativeElement.innerText = newValue;
      this.moveCursorToEnd()
      this.modalService.setRootViewContainerRef(this.viewContainerRef)
      this.modalService.addDynamicComponent("alert",null,"Bio cannot be greater than 200 characters.")
      this.bioEditSpan.nativeElement.blur();
    }
    this.bioEditForm.patchValue({ description: newValue });
  }
  moveCursorToEnd() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(this.bioEditSpan.nativeElement);
    range.collapse(false); 
    if(selection){
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  closeBioEdit(){
    this.isBioEditOpened = false
  }

  openNameEdit(){
    this.nameEditForm = this.fb.group({
      name:[this.chatDetails.name,[Validators.required,Validators.maxLength(40)]]
    })
    this.isNameEditOpened = true
    setTimeout(()=>{
      this.nameEditField.nativeElement.focus()
      this.nameEditField.nativeElement.value = this.chatDetails.name 
    })   
    this.isBioEditOpened = false 
  }

  checkNameLength(event:any){
    let newValue = event.target.value;
      if (newValue.length > this.maxNameContentLength) {
        newValue = newValue.slice(0, this.maxNameContentLength);
        this.nameEditField.nativeElement.value = newValue;
        this.modalService.setRootViewContainerRef(this.viewContainerRef)
        this.modalService.addDynamicComponent("alert",null,"Room name cannot be greater than 40 characters.")
        this.nameEditField.nativeElement.blur()
      }
  }

  closeNameEdit(){
    this.isNameEditOpened = false
  }

  clickedOutsideEmoji(){
    this.isEmojiOpened = false
  }
  toggleEmoji(){
    this.isEmojiOpened = !this.isEmojiOpened
  }
  addBioEmoji(event:any){
    const input = this.bioEditSpan.nativeElement;
    this.moveCursorToEnd()
    if (document.execCommand){
      var event1 = new Event('input');
      document.execCommand('insertText', false, event.emoji.native);
      return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(event.emoji.native, start, end, 'end');
  }
  addNameEmoji(event:any){
    const input = this.nameEditField.nativeElement;
    input.focus();
    if (document.execCommand){
      var event1 = new Event('input');
      document.execCommand('insertText', false, event.emoji.native);
      return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(event.emoji.native, start, end, 'end');
  }

  changeDescription(){
    if(this.chatDetails.description !== this.bioEditForm.controls["description"].value){
      const formData = this.bioEditForm.getRawValue()
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/change/desc`,formData,{headers}).subscribe((data)=>{
        this.ngOnInit()
      },(error)=>{
        console.log(error);
      })
    }
    this.isBioEditOpened = false
  }
  changeName(){
    if(this.chatDetails.name !== this.nameEditForm.controls["name"].value){
      const formData = this.nameEditForm.getRawValue()
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/room/${this.chatDetails.id}/change/name`,formData,{headers}).subscribe((data)=>{
        this.ngOnInit()
      },(error)=>{
        console.log(error);      
      })
    }
    this.isNameEditOpened = false    
  }
}
