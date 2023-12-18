import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message, sendMessage, userChats } from '../../../../models/data-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../../../services/app.service';
import { environment } from '../../../../../environments/environment.development';
import { ApiService } from '../../../../services/api.service';
import { MessageComponent } from './message/message.component';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../../../../services/data.service';
import { ParentMessageComponent } from './parent-message/parent-message.component';
import { EditMessageComponent } from './edit-message/edit-message.component';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MessageComponent,ParentMessageComponent,EditMessageComponent],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss'
})
export class ChatMessagesComponent implements OnInit,OnChanges{
  
  @ViewChild('scrollTarget') private myScrollContainer: ElementRef;
  @ViewChild('sendInput') myMessageSendField :ElementRef
  @Input() currentChat:userChats
  @Output() showProfileEvent = new EventEmitter<any>()
  currentChatPic: string|null
  messageForm:FormGroup
  messageList:message[]
  isMenuOpened:boolean = false
  parentMessage:message|null = null
  parentMessageId:number|null = null
  editMessage:message|null

  constructor(private fb: FormBuilder,private appService: AppService,private api:ApiService,private dataService:DataService){}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      content:['',[Validators.required]]
    })    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentChat.profile_pic) {
      this.currentChatPic = this.appService.getImageUrl(this.currentChat.profile_pic);
    }else{
      if(this.currentChat.type=="user"){
        this.currentChatPic= environment.USER_IMAGE            
      }else{
        this.currentChatPic= environment.ROOM_IMAGE
      }
    }
    if(this.currentChat.type==="user"){
      this.api.getReturn(`${environment.BASE_API_URL}/message/user/${this.currentChat.id}`).subscribe((data:message[])=>{
        this.messageList=data 
        this.setSendFieldFocus()
        setTimeout(() => this.scrollToBottom());
      },(error)=>{
        console.log(error);
      })
    }else{
      this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}`).subscribe((data:message[])=>{
        this.messageList=data
        this.setSendFieldFocus()
        setTimeout(() => this.scrollToBottom());
      },(error)=>{
        console.log(error);
      })
    }
  }

  sendMessage(){
    const formValue = this.messageForm.getRawValue();
      if(formValue.content==''){
        return
      }
    if (!this.editMessage) {
      const messageData: sendMessage={
        message:{
          content:formValue.content,
          parentMessage:this.parentMessage ? this.parentMessage.id : null
        },
        receiver:{
          type:this.currentChat.type,
          id:this.currentChat.id
        }
      }    
      const headers = new HttpHeaders().set('ResponseType','text')
      this.api.postReturn(`${environment.BASE_API_URL}/message/sendMessage`,messageData,{headers}).subscribe((data)=>{
        this.messageForm.reset()
        this.parentMessage = null
        this.ngOnChanges(data)
        this.dataService.notifyOther({
          status:"success"
        });
      },(error)=>{
        console.log(error);
      })      
    }else{
      const editData = {
        messageId:this.editMessage.id,
        newContent:formValue.content
      }
      const headers = new HttpHeaders().set('ResponseType','text')
      this.api.postReturn(`${environment.BASE_API_URL}/message/editMessage`,editData,{headers}).subscribe((data)=>{
        this.messageForm.reset()
        this.editMessage = null
        this.ngOnChanges(data)
        this.dataService.notifyOther({
          status:"success"
        });
      },(error)=>{
        console.log(error);
      }) 
    }
  }
  viewProfile(){
    this.showProfileEvent.emit("profile")
  }
  toggleMenu(){
    this.isMenuOpened = !this.isMenuOpened;
  }
  scrollToBottom() {
    if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
  }
  setSendFieldFocus(){
    if(this.myMessageSendField){
      this.myMessageSendField.nativeElement.focus()
    }
  }
  onDeleteSuccess(event:any){
    if(event){
      this.ngOnChanges(event)
    }
  }
  onReplyMessage(message:message){
    this.editMessage = null
    this.parentMessage=message
    this.setSendFieldFocus()
  }
  onCloseParentEvent(event:string){
    if(event){
      this.parentMessage=null
    }
  }
  onCloseEditEvent(event:string){
    if(event){
      this.editMessage=null
    }
  }
  onEditMessage(message:message){
    if(message){
      this.parentMessage = null
      this.editMessage = message
      this.setSendFieldFocus()
    }
  }
}
