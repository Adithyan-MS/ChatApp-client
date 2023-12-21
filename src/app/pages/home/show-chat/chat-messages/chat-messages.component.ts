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
import { ForwardMessageComponent } from './forward-message/forward-message.component';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MessageComponent,ParentMessageComponent,EditMessageComponent,ForwardMessageComponent],
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
  messageDateString:string
  showCheckBox:boolean
  selectedList:number[]=[]
  headerContent:string
  isForwardOpened:boolean=false
  forwardMessageList:number[]=[]
  
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
    this.showCheckBox=false
    this.headerContent="none"
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
    this.headerContent="search"
    setTimeout(()=>this.setSearchFieldFocus())
    
  }
  backSearch(){
    this.isSearchOpened =false
    this.showCheckBox=false
    this.selectedList=[]
    this.headerContent="none"
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

  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) return true;

    const d1 = new Date(this.messageList[messageIndex - 1].created_at);
    const d2 = new Date(this.messageList[messageIndex].created_at);

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }

  getMessageDate(messageIndex: number): string {
    let dateToday = new Date().toDateString();
    let longDateYesterday = new Date();
    longDateYesterday.setDate(new Date().getDate() - 1);
    let dateYesterday = longDateYesterday.toDateString();
    let today = dateToday.slice(0, dateToday.length - 5);
    let yesterday = dateYesterday.slice(0, dateToday.length - 5);

    const wholeDate = new Date(
      this.messageList[messageIndex].created_at
    ).toDateString();

    this.messageDateString = wholeDate.slice(0, wholeDate.length - 5);

    if (
      new Date(this.messageList[messageIndex].created_at).getFullYear() ===
      new Date().getFullYear()
    ) {
      if (this.messageDateString === today) {
        return "Today";
      } else if (this.messageDateString === yesterday) {
        return "Yesterday";
      } else {
        return this.messageDateString;
      }
    } else {
      return wholeDate;
    }
  }
  onShowCheckBox(event:any){
    this.showCheckBox=event
    this.headerContent="select"
  }
  onMessageChecked(event:any){
    if(event)
      this.selectedList.push(event)
    
  }
  onMessageUnChecked(event:any){
    if(event){
      const index: number = this.selectedList.indexOf(event);
      if (index !== -1) {
        this.selectedList.splice(index, 1);
      }
    }
  }
  onForwardMessageEvent(messageId:number){
    if(messageId){
      this.isForwardOpened=true
      this.forwardMessageList.push(messageId)
    }
  }
}
