import { Component,ElementRef,EventEmitter,HostListener,Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  User, message } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{

  @Input() message:message
  @Output() deleteSuccessEvent = new EventEmitter<any>()
  chatMessage:message
  currentUserId:number
  user:User|any
  sendTime:string
  isOptionsOpened:boolean = false
  isLikedUsersOpened:boolean = false
  likeCount:number
  likedUsers:any[]
  noUserPic:string = environment.USER_IMAGE

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
}
