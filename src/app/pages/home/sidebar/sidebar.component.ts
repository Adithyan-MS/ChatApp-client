import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../services/api/api.service';
import { userChats } from '../../../models/data-types';
import { DataService } from '../../../services/data-transfer/data.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalService } from '../../../services/modal/modal.service';
import { SenderService } from '../show-chat/chat-messages/message-service/sender.service';
import { AnimationService } from '../../../services/animations/animation.service';
import { Subject, interval, takeUntil } from 'rxjs';
import { NewMessagesService } from '../../../services/new-messages.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,ChatComponent,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations:[AnimationService.prototype.getItemMovementAnimation(),AnimationService.prototype.getVerticalMovementAnimation(),AnimationService.prototype.getDropdownAnimation()]
})
export class SidebarComponent implements OnInit,OnDestroy{

  chats:userChats[]
  starredChats:userChats[]
  user:string|any
  userId:number
  userName:string
  clickedChat?:string
  isStarredMessageOpened:boolean = false
  @Output() mobileViewEvent = new EventEmitter<any>()
  @ViewChild("searchChatField") searchChatField:ElementRef
  searchName:string=""
  private destroy$ = new Subject<void>();

  constructor(private api:ApiService,private router:Router,private route:ActivatedRoute,private dataService : DataService,private messageService:SenderService,private modalService: ModalService,private viewContainerRef: ViewContainerRef
    ){}

  ngOnInit(): void {
    this.getUserChats()
    if(typeof localStorage != undefined){
      this.user = localStorage.getItem("user");
      this.userId = JSON.parse(this.user).id; 
      this.userName = JSON.parse(this.user).name; 
    }
    this.dataService.notifyObservable$.subscribe((data)=>{       
      if(data.length==0 || (data == "chat" && !this.isStarredMessageOpened)){
        this.getUserChats()
      }else{
        this.getStarredMessages()
      }
    })
    // this.stompService.subscibe(`/user/${this.userId}/queue/messages`,()=>{

    //   this.getUserChats()
    // })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getUserChats(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
      this.chats=data
      console.log(this.chats);
      
    },(error)=>{
      console.log(error);      
    })
  }
  checkSize():boolean{
    return window.innerWidth <= 500 ?  true :  false
  }

  showChat(chat:userChats){
    if(this.isStarredMessageOpened)
      this.messageService.setSelectedMessageId(chat.latest_message_id)
    this.router.navigate([chat.name], {relativeTo:this.route});
    this.dataService.notifyOther({
      view:"chat",
      data:chat
    })
    if(this.checkSize())
      this.mobileViewEvent.emit(true)
  }
  clickChat(chatId:string){
    this.clickedChat=chatId
  }
  showCreateRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("createRoom","Create Room",null)
  }
  showJoinRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("joinRoom","Join Room",null)
  }

  onSearchChange(event:any){
      this.searchName = event.target.value
      if(this.searchName !==""){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("name",this.searchName);
        if (!this.isStarredMessageOpened) {
          this.api.getReturn(`${environment.BASE_API_URL}/user/search`,{params:queryParams}).subscribe((data)=>{
            this.chats=data
          },(error)=>{
            console.log(error);
          })
        }else{
          this.starredChats = this.starredChats.filter((chat)=>{
            return chat.name.toLowerCase().includes(this.searchName.toLocaleLowerCase())
          })
        }
      }else{
        if (!this.isStarredMessageOpened) {
          this.getUserChats()          
        } else {
          this.getStarredMessages()
        }
    }
  }
  showStarredMessage(){
    this.isStarredMessageOpened=true
    this.getStarredMessages()
    this.clickedChat=undefined
    this.router.navigate(['starredMessages'], {relativeTo:this.route});
  }
  closeStarredMessage(){
    this.isStarredMessageOpened=false
    this.getUserChats()
    this.clickedChat=undefined
    this.messageService.setSelectedMessageId(null)
    this.router.navigate(['/home']);
  }
  getStarredMessages(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/starredMessages`).subscribe((data)=>{
      this.starredChats=data
    },(error)=>console.log(error))
  }
}
