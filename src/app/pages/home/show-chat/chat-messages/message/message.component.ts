import { Component,ElementRef,EventEmitter,HostListener,Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  User, message } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { ParentMessageComponent } from '../parent-message/parent-message.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule,ParentMessageComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{

  @Input() message:message
  @Output() deleteSuccessEvent = new EventEmitter<any>()
  @Output() replyMessageEvent = new EventEmitter<any>()
  @Output() editMessageEvent = new EventEmitter<any>()
  chatMessage:message
  currentUserId:number
  user:User|any
  sendTime:string
  isOptionsOpened:boolean = false
  isLikedUsersOpened:boolean = false
  likeCount:number
  likedUsers:any[]
  noUserPic:string = environment.USER_IMAGE
  starredFlag:boolean

  constructor(private appService: AppService,private elementRef: ElementRef,private api:ApiService){}

  ngOnInit(): void {
    this.user = localStorage.getItem("user");
    this.currentUserId = JSON.parse(this.user).id;
    this.chatMessage=this.message;
    this.sendTime = this.appService.HHMMFormatter(this.message.modified_at);
  }

  optionsToggle(){
    this.isOptionsOpened = !this.isOptionsOpened
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOptionsOpened = false;
      this.isLikedUsersOpened=false
    }
  }
  likeMessage(){
    this.api.postReturn(`${environment.BASE_API_URL}/message/like/${this.message.id}`,null).subscribe((data:number)=>{
      console.log(data);
      this.message.like_count=data
      this.isOptionsOpened = false;
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
      this.isOptionsOpened = false;
    },(error)=>{
      console.log(error);
    })
  }
  replyMessage(){
    this.replyMessageEvent.emit(this.message)
    this.isOptionsOpened = false;
  }
  editMessage(){
    this.editMessageEvent.emit(this.message)
    this.isOptionsOpened = false;
  }
  starMessage(){
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/starOrUnstarMessage/${this.message.id}`,null,{headers}).subscribe((data)=>{
      console.log(data);
      
      if(data =="starred"){
        this.starredFlag=true
      }else{
        this.starredFlag=false
      }
    },(error)=>{
      console.log(error);
    })
  }
}
