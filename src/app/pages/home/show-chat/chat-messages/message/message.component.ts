import { Component,ElementRef,EventEmitter,HostListener,Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  User, message } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { ParentMessageComponent } from '../parent-message/parent-message.component';
import { SenderService } from '../message-service/sender.service';
import { DataService } from '../../../../../services/data.service';
import { AnimationService } from '../../../../../services/animation.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from '../../../../../services/modal.service';
import { ClickOutsideDirective } from '../../../../../directives/clickOutside/click-outside.directive';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule,ParentMessageComponent,ClickOutsideDirective],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  animations:[AnimationService.prototype.getDropdownAnimation(),AnimationService.prototype.getDropupAnimation()]
})
export class MessageComponent implements OnInit,OnChanges{

  @Input() message:message
  @Input() showCheckBox:boolean
  @Input() index:number
  @Input() isCurrentUserPastParticipant:boolean
  @Output() deleteSuccessEvent = new EventEmitter<any>()
  @Output() replyMessageEvent = new EventEmitter<any>()
  @Output() editMessageEvent = new EventEmitter<any>()
  @Output() showCheckBoxEvent = new EventEmitter<any>()
  @Output() notifyCheckedMssageEvent = new EventEmitter<any>()
  @Output() notifyUnCheckedMssageEvent = new EventEmitter<any>()
  @Output() forwardMssageEvent = new EventEmitter<any>()
  chatMessage:message
  currentUserId:number
  user:User|any
  sendTime:string
  isLikedUsersOpened:boolean = false
  likeCount:number
  likedUsers:any[]
  noUserPic:string = environment.USER_IMAGE
  starredFlag:boolean|null
  isMessageChecked:boolean=false
  imageUrl:string
  imageParentUrl:string
  isOpened:boolean=false

  constructor(private appService: AppService,private modalService: ModalService,private viewContainerRef: ViewContainerRef,private dataService:DataService,private elementRef: ElementRef,private api:ApiService,private senderNameService:SenderService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit()
  }

  ngOnInit(): void {    
    this.user = localStorage.getItem("user");
    this.currentUserId = JSON.parse(this.user).id;
    this.chatMessage=this.message;
    this.sendTime = this.appService.HHMMFormatter(this.message.modified_at);
    this.starredFlag=this.message.is_starred    
    if(this.message.type=="image")
      this.imageUrl = this.appService.getMessageImageUrl(this.message.sender_name,this.message.content);
    if(this.message.parent_message_id)
      this.imageParentUrl = this.appService.getMessageImageUrl(this.message.parent_message_sender,this.message.parent_message_content);
    
    }

  shouldDisplaySenderName(currentSenderName: string): boolean {
    const display = currentSenderName !== this.senderNameService.getPreviousSenderName();
    this.senderNameService.setPreviousSenderName(currentSenderName); 
    return display;
  }

  likeMessage(){
    this.api.postReturn(`${environment.BASE_API_URL}/message/like/${this.message.id}`,null).subscribe((data:number)=>{
      this.message.like_count=data
      this.getLikedUsers()
    },(error)=>{
      console.log(error);
    })
  }
  LikedUsersToggle(){
    this.isLikedUsersOpened = !this.isLikedUsersOpened
    if(this.isLikedUsersOpened){
      this.getLikedUsers()
      
    }
  }
  getLikedUsers(){
    this.api.getReturn(`${environment.BASE_API_URL}/message/likes/${this.message.id}`).subscribe((data)=>{
      this.likedUsers = data
    })
  }
  deleteMessage(){
    const reqBody = {
      messageIds:[this.message.id]
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/deleteMessage`,reqBody,{headers}).subscribe((data)=>{
      this.deleteSuccessEvent.emit(data)
    },(error)=>{
      console.log(error);
    })
  }
  replyMessage(){
    this.isOpened=false
    this.replyMessageEvent.emit(this.message)
  }
  editMessage(){
    this.isOpened=false
    this.editMessageEvent.emit(this.message)
  }
  starMessage(){
    const reqBody={
      messageIds:[this.message.id]
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/starOrUnstarMessage`,reqBody,{headers}).subscribe((data)=>{
      if(data ==`\nmessage ${this.message.id}starred`){
        this.starredFlag=true
      }else{
        this.starredFlag=false
      }
      this.dataService.notifyOther({
        view:"chat"
      })
    },(error)=>{
      console.log(error);
    })
  }
  checkMessage(){
    this.showCheckBoxEvent.emit(true)    
    this.isMessageChecked = true
    this.notifyCheckedMssageEvent.emit(this.message.id)
  }
  checkCheckBoxvalue(event:any){
    if(event.target.checked){
      this.notifyCheckedMssageEvent.emit(this.message.id)
    }else{
      this.notifyUnCheckedMssageEvent.emit(this.message.id)
    }    
  }
  forwardMessage(){
    this.forwardMssageEvent.emit(this.message.id)
  }

  viewImage(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("viewImage",this.imageUrl)
  }

  downloadedFiles:any
  
  openDocument(){
    // this.downloadedFiles = localStorage.getItem('downloadedFiles');
    // this.downloadedFiles = JSON.parse(this.downloadedFiles) || {};
    // if(this.downloadedFiles!=null){
    //   const fileExistsLocally = this.downloadedFiles[this.message.content];
    //   if (fileExistsLocally) {
    //     console.log("knkc");
        
    //     window.open(`C:/Users/LENOVO/Downloads/${this.message.content}`, '_blank');
    //   } else {
    //     window.open(`${environment.BASE_API_URL}/message/view/${this.message.sender_name}/document/${this.message.content}`, '_blank');
    //     this.downloadedFiles[this.message.content] = true;
    //     localStorage.setItem('downloadedFiles', JSON.stringify(this.downloadedFiles));
    //   }
    // }

    window.open(`${environment.BASE_API_URL}/message/view/${this.message.sender_name}/document/${this.message.content}`, '_blank');

  }
  clickedOutsideLike(){
    this.isLikedUsersOpened = false
  }
}
