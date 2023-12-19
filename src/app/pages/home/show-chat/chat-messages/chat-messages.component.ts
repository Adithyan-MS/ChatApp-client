import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message, sendMessage, userChats } from '../../../../models/data-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../../../services/app.service';
import { environment } from '../../../../../environments/environment.development';
import { ApiService } from '../../../../services/api.service';
import { MessageComponent } from './message/message.component';
import { HttpHeaders, HttpParams } from '@angular/common/http';
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
  @ViewChild('searchInput') searchField :ElementRef
  @Input() currentChat:userChats
  @Output() showProfileEvent = new EventEmitter<any>()
  currentChatPic: string|null
  messageForm:FormGroup
  messageList:message[]
  isMenuOpened:boolean = false
  parentMessage:message|null = null
  parentMessageId:number|null = null
  editMessage:message|null
  isSearchOpened:boolean = false;

  constructor(private fb: FormBuilder,private appService: AppService,private api:ApiService,private dataService:DataService,private elementRef: ElementRef){}

  ngOnInit(): void {
    this.dataService.notifyObservable$.subscribe((data)=>{
      if(data=="openSearch"){
        this.openSearch()
      }
    })
    this.messageForm = this.fb.group({
      content:['',[Validators.required]]
    })    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isSearchOpened=false
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
      this.getUserChatMessage();
    }else{
      this.getRoomChatMessage();
    }
  }
  getUserChatMessage(){
    this.api.getReturn(`${environment.BASE_API_URL}/message/user/${this.currentChat.id}`).subscribe((data:message[])=>{
      this.messageList=data 
      if(!this.isSearchOpened){
        this.setSendFieldFocus()
      }
      setTimeout(() => this.scrollToBottom());
    },(error)=>{
      console.log(error);
    })
  }
  getRoomChatMessage(){
    this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}`).subscribe((data:message[])=>{
      this.messageList=data
      if(!this.isSearchOpened){
        this.setSendFieldFocus()
      }
      setTimeout(() => this.scrollToBottom());
    },(error)=>{
      console.log(error);
    })
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
  setSearchFieldFocus(){
    console.log(this.searchField);
    
    if(this.searchField){
      this.searchField.nativeElement.focus()
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
  openSearch(){
    this.isSearchOpened=true
    setTimeout(()=>this.setSearchFieldFocus())
    
  }
  backSearch(){
    this.isSearchOpened =false
    if(this.currentChat.type==="user"){
      this.getUserChatMessage();
    }else{
      this.getRoomChatMessage();
    }
  }
  searchMessage(event:any){
    const searchContent = event.target.value
    if(searchContent != ''){
      let queryParams = new HttpParams();
      queryParams = queryParams.append("value",searchContent);
      if(this.currentChat.type=="user"){
        this.api.getReturn(`${environment.BASE_API_URL}/message/user/${this.currentChat.id}/search`,{params:queryParams}).subscribe((data)=>{
        this.messageList=data       
        },(error)=>console.log(error))   
      }else{
        this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}/search`,{params:queryParams}).subscribe((data)=>{
          this.messageList=data       
          },(error)=>console.log(error)) 
      }
    }else{
      if(this.currentChat.type==="user"){
        this.getUserChatMessage();
      }else{
        this.getRoomChatMessage();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isMenuOpened = false;
    }
  }
}
