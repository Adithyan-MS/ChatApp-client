import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { message, receiver, sendMessage, userChats } from '../../../../models/data-types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../../../services/app.service';
import { environment } from '../../../../../environments/environment.development';
import { ApiService } from '../../../../services/api.service';
import { MessageComponent } from './message/message.component';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
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
import { ModalService } from '../../../../services/modal.service';
import { Subject, interval, takeUntil } from 'rxjs';
import { AudioRecordComponent } from './audio-record/audio-record.component';
import { AudioRecordingService } from './audio-record/audio-recording.service';
import { FileUploadService } from './send-file/file-upload.service';
import { NewMessagesService } from '../../../../services/new-messages.service';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ClickOutsideDirective,SendFileComponent,MessageComponent,ParentMessageComponent,EditMessageComponent,ForwardMessageComponent,PickerComponent,AudioRecordComponent],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  animations:[AnimationService.prototype.getDropupAnimation(),AnimationService.prototype.getDropdownAnimation(),AnimationService.prototype.getPopupAnimation()]
})
export class ChatMessagesComponent implements OnInit,OnChanges,OnDestroy,AfterViewChecked{
  
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
  fileType:string=""
  isEmojiOpened:boolean = false
  roomUsers:string
  scrollToBottomSucess:boolean = false
  scrollToMessageSucess:boolean = false
  sendFieldFocusSuccess:boolean = false
  isAudioOpened:boolean = false
  filteredMessages:message[]=[]
  highlightedIndex:number
  isSearchMessageNotFound:boolean = false
  private destroy$ = new Subject<void>();
  searchContent:any = null
  audioSendProgress:any = null

  socket?:WebSocket
  stompClient?: any 
  constructor(private newMessageService : NewMessagesService,private fileUploadService: FileUploadService ,private audioRecordingService: AudioRecordingService ,private fb: FormBuilder,private router:Router,private route:ActivatedRoute,private renderer: Renderer2,private appService: AppService,private api:ApiService,private dataService:DataService,private messageService:SenderService,private elementRef: ElementRef,private modalService: ModalService,private viewContainerRef: ViewContainerRef, private senderNameService: SenderService){
  }
  
  ngOnInit(): void {
    interval(2000)
      // .pipe(takeUntil(this.destroy$))
      // .subscribe(()=>{
      //   if(this.currentChat.type==="user"){
      //     this.getUserChatMessage()
      //   }else{
      //     this.getRoomChatMessage()
      //   }
      // })
      this.dataService.notifyObservable$.subscribe((data)=>{
        if(data=="openSearch")
        this.openSearch()
      })
    this.messageForm = this.fb.group({
      content:['',[Validators.required]]
    })
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.sendAudio(blob)
    });

    var sockJsProtocols = ["websocket", "xhr-streaming", "xhr-polling"];
    var sockJsClient = new SockJS(`http://localhost:8080/ws`, null, { transports: sockJsProtocols });
    this.stompClient = Stomp.over(sockJsClient);
    
    this.stompClient.connect({}, (frame:any) => {
      console.log('connected to: ' + frame);
    });
    
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
  ngAfterViewChecked(): void {    
    if(!this.isSearchOpened && !this.isForwardOpened && !this.sendFieldFocusSuccess)
      this.setSendFieldFocus()
    if(this.locateMessageId!=null){
      if(this.scrollToMessageSucess==false)
        this.scrollToMessage(this.locateMessageId)
    }else if(this.scrollToBottomSucess==false){
      this.scrollToBottom()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.senderNameService.setPreviousSenderName("")
    this.isSearchOpened=false
    this.showCheckBox=false
    this.scrollToBottomSucess=false
    this.isAudioOpened = false
    this.scrollToMessageSucess=false
    this.isForwardOpened=false
    this.parentMessage = null
    this.selectedFiles=[]
    this.editMessage = null
    this.headerContent="none"
    this.selectedList = []
    this.showSendFilePreview=false
    this.images=[]
    this.sendFieldFocusSuccess = false
    this.filteredMessages=[]
    this.highlightedIndex = -1
    this.isSearchMessageNotFound = false
    this.currentChat.type=="user" ? (this.currentChatPic = this.currentChat.profile_pic ? this.appService.getImageUrl(`user_${this.currentChat.id}`,this.currentChat.profile_pic) : environment.USER_IMAGE) : this.currentChatPic = this.currentChat.profile_pic ? this.appService.getImageUrl(`room_${this.currentChat.id}`,this.currentChat.profile_pic) : environment.ROOM_IMAGE
    this.locateMessageId=this.messageService.getSelectedMessageId()

    this.newMessageService.setOpenedChat(this.currentChat.type+this.currentChat.id)
    this.newMessageService.setMessageAsViewed(this.currentChat.type,this.currentChat.id)
    
    if(this.currentChat.type==="user"){
      this.getUserChatMessage();
    }else{
      this.getRoomChatMessage();
      this.getActiveUsers()
    }
  }

  getUserChatMessage(){
    this.api.getReturn(`${environment.BASE_API_URL}/message/user/${this.currentChat.id}`).subscribe((data:message[])=>{
      this.messageList=data            
      },(error)=>console.log(error))      
  }
  getRoomChatMessage(){
      this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}`).subscribe((data:message[])=>{
        this.messageList=data
    },(error)=>console.log(error))
  }
  getActiveUsers(){
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.currentChat.id}/userList`).subscribe((data:string[])=>{
      this.roomUsers = data.join(', ')
    },(error)=>console.log(error))
  }

  onScroll(){
    if(this.isScrollAtBottom()){
      this.scrollToBottomSucess = true
    }
  }

  isScrollAtBottom(): boolean {
    const scrollTop = this.myScrollContainer.nativeElement.scrollTop;
    const scrollHeight = this.myScrollContainer.nativeElement.scrollHeight;
    const containerHeight = this.myScrollContainer.nativeElement.clientHeight;
    return scrollHeight - (scrollTop + containerHeight) < 10;
  }

  sendMessage(){
    const formValue = this.messageForm.getRawValue();
    if(formValue.content=='')
        return
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
    if (this.myScrollContainer && this.myScrollContainer.nativeElement) 
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  scrollToMessage(messageId: number | null): void {
    const container: HTMLElement = this.myScrollContainer.nativeElement;
    const messageElement = container.querySelector(`#message-${messageId}`) as HTMLElement;
  
    if (messageElement) {
      const scrollTo = messageElement.offsetTop - container.offsetTop - container.clientHeight / 2 + messageElement.clientHeight / 2;
      messageElement.style.backgroundColor = 'rgba(171, 197, 207, 0.5)';
      
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
  
      setTimeout(() => {
        messageElement.style.backgroundColor = '';
      }, 1000);
    }
  
    this.scrollToMessageSucess = true;
  }
  setSendFieldFocus(){
    if(this.myMessageSendField){
      this.myMessageSendField.nativeElement.focus()
      this.sendFieldFocusSuccess = true
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
      this.dataService.notifyOther({
        view:"chat"
      });
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
      this.searchContent = searchContent
      this.filteredMessages = this.messageList.filter((message) =>
        message.content.toLowerCase().includes(this.searchContent.toLowerCase()) && message.type=="text"
      );
      this.highlightedIndex = this.filteredMessages.length != 0 ? this.filteredMessages.length - 1 : -1      
      this.scrollToMessage(this.filteredMessages[this.highlightedIndex].id)
    }
  }

  upSearchControl(){
    if(this.highlightedIndex > 0){
      this.highlightedIndex--;
      this.scrollToMessage(this.filteredMessages[this.highlightedIndex].id)
    }else{
      this.showNotFoundDialog(2)
    }    
  }
  downSearchControl(){
    if(this.highlightedIndex < this.filteredMessages.length-1){
      this.highlightedIndex++;
      this.scrollToMessage(this.filteredMessages[this.highlightedIndex].id)
    }else{
      this.scrollToMessage(this.filteredMessages[this.highlightedIndex].id)
    }
  }

  showNotFoundDialog(seconds: number): void {
    this.isSearchMessageNotFound = true;  
    setTimeout(() => {
      this.isSearchMessageNotFound = false;
    },seconds * 1000);
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
  backSelect(){
    this.showCheckBox=false
    this.selectedList=[]
    this.headerContent="none"
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
      this.ngOnChanges(data)
      this.dataService.notifyOther({
        view:"chat"
      });
    },(error)=>console.log(error))
    this.selectedList = []
  }
  onForwardCancel(event:any){
    if(this.isForwardOpened){
      this.isForwardOpened=false
      this.selectedList = []
    }
  }
  forwardMessages(){
    this.isForwardOpened=true
  }
  deleteMessages(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent('confirmation','Delete messages','Are you sure you want to delete these messages?').then((value)=>{
      if(value){
        const reqBody = {
          messageIds:this.selectedList
        }
        const headers = new HttpHeaders().set("ResponseType","text")
        this.api.postReturn(`${environment.BASE_API_URL}/message/deleteMessage`,reqBody,{headers}).subscribe((data)=>{
          this.selectedList = []
          this.ngOnChanges(data)
          this.dataService.notifyOther({
            view:"chat"
          });
        },(error)=>{
          console.log(error);
        })
      }
    }).catch((error)=>console.log(error));
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
    },(error)=>console.log(error))
  }
  toggleSendMenu(){
    this.isSendMenuOpen = !this.isSendMenuOpen
  }
  onFilechange(event:any){
    const files: FileList = event.target.files;
    if(files[0].size > 30000000){
      this.modalService.setRootViewContainerRef(this.viewContainerRef)
      this.modalService.addDynamicComponent("alert","sendFile","Sorry, file size must be less than 30MB")
      return
    }
    this.fileType = (files[0].type.includes("image")) ? "image" : (files[0].type.includes("video")) ? "video" : "document";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.images.push({
          file:e.target.result,
            type:file.type,
            name:file["name"],
            size:this.appService.formatFileSize(file.size),
            progress:null
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
      this.selectedFiles=[]
    }
  }
  onFileSendSuccess(event:any){
    this.parentMessage = null
    this.ngOnChanges(event)
    this.dataService.notifyOther({
      view:"chat"
    });
  }
  clickedOutsideSendFile(){
        this.showSendFilePreview=false
        this.images=[]
  }
  toggleEmoji(){
    this.isEmojiOpened = !this.isEmojiOpened
  }

  addEmoji(event:any){
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
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent('confirmation','Clear this chat?','Are you sure you want to clear this chat?').then((value)=>{
      if(value){
        this.messageList.map((message)=>{
          this.selectedList.push(message.id)
        })
        this.deleteMessages()
      }
    }).catch((error)=>console.log(error));
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
  showAudioRecord(){
    this.isAudioOpened = true
  }

  onAudioStatus(event:any){
    this.isAudioOpened = false
  }
  
  sendAudio(blob:Blob){
    const messageRequest = {
      message:{
        content:"file",
        type:"audio",
        parentMessage: this.parentMessage!=null ? this.parentMessage?.id : null
      },
      receiver:{
        type:this.currentChat.type,
        id:this.currentChat.id
      }
    }
    let formData: FormData = new FormData();
    formData.append('file', blob);
    formData.append('messageData', JSON.stringify(messageRequest));
    this.fileUploadService.upload(formData).subscribe({
      next: (event: any)=>{
        if(event.type === HttpEventType.UploadProgress){
          this.audioSendProgress = Math.round((100 * event.loaded) / event.total);
        }else if(event instanceof HttpResponse){
          this.audioSendProgress = null
        }
      },
      error:(err: any) => {
        this.audioSendProgress = null
      },
      complete: () => {
        this.isAudioOpened = false
      }
    })
  }
  clickedOutsideAudio(){
    this.isAudioOpened = false
    this.audioRecordingService.abortRecording()
  }
}
