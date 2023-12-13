import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { DataService } from '../../../services/data.service';
import { message, sendMessage, userChats } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.development';
import { AppService } from '../../../services/app.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatProfileComponent } from './chat-profile/chat-profile.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';

@Component({
  selector: 'app-show-chat',
  standalone: true,
  imports: [CommonModule,MessageComponent,ReactiveFormsModule,ChatProfileComponent,CreateRoomComponent,JoinRoomComponent],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss'
})
export class ShowChatComponent implements OnInit,AfterViewInit{

  currentChat: userChats
  currentChatPic: string|null
  name:string
  showWhat:string
  messageList:message[]
  messageForm:FormGroup
  showProfile:boolean
  isMenuOpened:boolean = false
  @ViewChildren('scrollTarget') private myScrollContainer: ElementRef;
  
  constructor(private fb: FormBuilder,private dataService:DataService,private api: ApiService,private appService: AppService,private router:Router){}

  ngAfterViewInit(): void {   
     
  }

  ngOnInit(): void { 
    this.dataService.notifyObservable$.subscribe(res=>{
      if(res.view==="chat"){
        this.showWhat="chat"       
        this.currentChat = res.data;
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
          },(error)=>{
            console.log(error);
          })
        }else{
          this.api.getReturn(`${environment.BASE_API_URL}/message/room/${this.currentChat.id}`).subscribe((data:message[])=>{
            this.messageList=data           
          },(error)=>{
            console.log(error);
          })
        }
      }else if(res.view === "createRoom"){
          this.showWhat=res.view
      }
      else if(res.view === "joinRoom"){
          this.showWhat=res.view
      }
    })
    console.log(this.myScrollContainer);
    
    if (this.myScrollContainer) {
      this.scrollToBottom();
    }   

    this.messageForm = this.fb.group({
      content:['',[Validators.required]]
    })

  }

  sendMessage(){
    const formValue = this.messageForm.getRawValue();
    const messageData: sendMessage={
      message:{
        content:formValue.content,
        parentMessage:null
      },
      receiver:{
        type:this.currentChat.type,
        id:this.currentChat.id
      }
    }    
    const headers = new HttpHeaders().set('ResponseType','text')
    this.api.postReturn(`${environment.BASE_API_URL}/message/sendMessage`,messageData,{headers}).subscribe((data)=>{
      this.messageForm.reset()
      this.ngOnInit()
    },(error)=>{
      console.log(error);
    })
  }

  viewProfile(){
    this.showWhat="profile"
  }

  viewEvent($event:string){
    this.showWhat="chat"
  }

  toggleMenu(){
    this.isMenuOpened = !this.isMenuOpened;
  }

  scrollToBottom() {
    try {
      console.log(this.myScrollContainer);
      if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  onCancelEvent(value:any){
    if(this.currentChat){
      this.showWhat = value
    }else{
      this.showWhat = "startChat"
    }
  }
}
