import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message, receiver, sendMessage, userChats } from '../../../../models/data-types';
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
import { SenderService } from './message-service/sender.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationService } from '../../../../services/animation.service';
import { SendFileComponent } from './send-file/send-file.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../../../../directives/clickOutside/click-outside.directive';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ClickOutsideDirective,SendFileComponent,MessageComponent,ParentMessageComponent,EditMessageComponent,ForwardMessageComponent,PickerComponent],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  animations:[AnimationService.prototype.getDropupAnimation(),AnimationService.prototype.getDropdownAnimation(),AnimationService.prototype.getPopupAnimation()]
})
export class ChatMessagesComponent implements OnInit,OnChanges{
  
  @ViewChild('scrollTarget') private myScrollContainer: ElementRef;
  @ViewChild('sendInput') myMessageSendField :ElementRef
  @ViewChild('searchInput') searchField :ElementRef 
  @Input() currentChat:userChats 
  @Input() isCurrentUserPastParticipant:boolean
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
  locateMessageId:number|null
  isSendMenuOpen:boolean = false
  showSendFilePreview:boolean=false
  selectedFiles: File[] = [];
  images:any[]=[]
  documents:any[]=[]
  isFileTypeImage:boolean = false
  isEmojiOpened:boolean = false
  
  constructor(private fb: FormBuilder,private router:Router,private route:ActivatedRoute,private appService: AppService,private api:ApiService,private dataService:DataService,private messageService:SenderService,private elementRef: ElementRef){}
  
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
    this.isForwardOpened=false
    this.parentMessage = null
    this.editMessage = null
    this.headerContent="none"
    if (this.currentChat.profile_pic) {
      this.currentChatPic = this.appService.getImageUrl(this.currentChat.name,this.currentChat.profile_pic);
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
      console.log(this.messageList);
      
      if(!this.isSearchOpened){
        this.setSendFieldFocus()
      }
      this.locateMessageId=this.messageService.getSelectedMessageId()
        if(this.locateMessageId!=null){
          setTimeout(() => this.scrollToMessage(this.locateMessageId),(10))
        }else{
          setTimeout(() => this.scrollToBottom(),(20));
        }
        this.showSendFilePreview=false
        this.images=[]
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
        this.locateMessageId=this.messageService.getSelectedMessageId()
        if(this.locateMessageId!=null){
          setTimeout(() => this.scrollToMessage(this.locateMessageId),(10))
        }else{
          setTimeout(() => this.scrollToBottom(),(20));
        }
        this.showSendFilePreview=false
        this.images=[]
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
          type:"text",
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
          view:"chat"
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
          view:"chat"
        });
      },(error)=>{
        console.log(error);
      }) 
    }
  }
  viewProfile(){
    this.router.navigate([`${this.currentChat.name}/profile`],{relativeTo:this.route})
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
  scrollToMessage(messageId: number|null): void {
    const container: HTMLElement = this.myScrollContainer.nativeElement;
    const messageElement = container.querySelector(`#message-${messageId}`) as HTMLElement;
    if (messageElement) {
      const containerRect = container.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      const scrollTo = messageRect.top - containerRect.top - containerRect.height / 2 + messageRect.height / 2;
      messageElement.style.backgroundColor = 'rgba(171, 197, 207, 0.5)';
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
      setTimeout(() => {
        messageElement.style.backgroundColor = '';
      }, 1000);
    }
  }
  setSendFieldFocus(){
    if(this.myMessageSendField){
      this.myMessageSendField.nativeElement.focus()
    }
  }
  setSearchFieldFocus(){
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
      this.myMessageSendField.nativeElement.value = this.editMessage.content
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
      this.selectedList.push(messageId)
    }
  }
  onForwardSumbit(receiversList:receiver[]){
    const reqBody = {
      messageIds:this.selectedList,
      receivers:receiversList
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/forwardMessage`,reqBody,{headers}).subscribe((data)=>{
      this.isForwardOpened = false
      this.selectedList = []
      this.ngOnChanges(data)
        this.dataService.notifyOther({
          view:"chat"
        });
    },(error)=>console.log(error))
  }
  onForwardCancel(event:any){
    if(this.isForwardOpened)
      this.isForwardOpened=false
  }
  forwardMessages(){
    this.isForwardOpened=true
  }
  deleteMessages(){
    const reqBody = {
      messageIds:this.selectedList
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/deleteMessage`,reqBody,{headers}).subscribe((data)=>{
      this.selectedList = []
      this.ngOnChanges(data)
    },(error)=>{
      console.log(error);
    })
  }
  starMessages(){
    const reqBody={
      messageIds:this.selectedList
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/message/starOrUnstarMessage`,reqBody,{headers}).subscribe((data)=>{
      this.selectedList=[]   
      this.ngOnChanges(data)
      this.dataService.notifyOther({
        view:"chat"
      })
    },(error)=>{
      console.log(error);
    })
  }
  toggleSendMenu(){
    this.isSendMenuOpen = !this.isSendMenuOpen
  }
  onFilechange(event:any){
    const files: FileList = event.target.files;
    if(files[0].type.includes("image"))
      this.isFileTypeImage = true
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.images.push({
            file:e.target.result,
            type:file.type,
            name:file["name"],
            size:this.appService.formatFileSize(file.size)
          });
      };
      reader.readAsDataURL(file);
    }
    this.isSendMenuOpen = false
    this.showSendFilePreview=true
  }
  onCloseSendFileEvent(event:any){
    if(event){
      this.showSendFilePreview=false
      this.images=[]
    }
  }
  onFileSendSuccess(event:any){
    this.parentMessage = null
    this.ngOnChanges(event)
    this.dataService.notifyOther({
      view:"chat"
    });
  }
  toggleEmoji(){
    this.isEmojiOpened = !this.isEmojiOpened
  }

  addEmoji(event:any){
    console.log(event.emoji.native);
    const input = this.myMessageSendField.nativeElement;
    input.focus();
    if (document.execCommand){
      var event1 = new Event('input');
      document.execCommand('insertText', false, event.emoji.native);
      return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(event.emoji.native, start, end, 'end');
  }
  clearChat(){
    this.messageList.map((message)=>{
      this.selectedList.push(message.id)
    })
    this.deleteMessages()
  }

  clickedOutsideMenu(){
    this.isMenuOpened = false
  }
  clickedOutsideAttach(){
    this.isSendMenuOpen = false
  }
  clickedOutsideEmoji(){
    this.isEmojiOpened = false
  }

  mobileBack(){
    this.dataService.notifyOther("mobile-back")
  }
}
