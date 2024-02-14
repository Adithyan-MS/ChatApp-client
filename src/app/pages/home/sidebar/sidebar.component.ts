import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../services/api.service';
import { userChats } from '../../../models/data-types';
import { DataService } from '../../../services/data.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { SenderService } from '../show-chat/chat-messages/message-service/sender.service';
import { AnimationService } from '../../../services/animation.service';
import { Subject, interval, takeUntil } from 'rxjs';

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
  user:string|any
  userId:number
  clickedIndex?:number
  isStarredMessageOpened:boolean = false
  isSearching:boolean = false
  @Output() mobileViewEvent = new EventEmitter<any>()
  @ViewChild("searchChatField") searchChatField:ElementRef
  searchName:string=""
  private destroy$ = new Subject<void>();

  constructor(private api:ApiService,private router:Router,private route:ActivatedRoute,private dataService : DataService,private messageService:SenderService,private modalService: ModalService,private viewContainerRef: ViewContainerRef
    ){}

  ngOnInit(): void {
    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(()=>{
        if(!this.isStarredMessageOpened && this.searchName ===""){
          this.getUserChats()
        }
      })
    if(typeof localStorage != undefined){
      this.user = localStorage.getItem("user");
      this.userId = JSON.parse(this.user).id; 
    }
    this.getUserChats()
    this.dataService.notifyObservable$.subscribe((data)=>{ 
      if(data.length==0 || (data && !this.isStarredMessageOpened)){
        this.getUserChats()
      }else{
        this.getStarredMessages()
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getUserChats(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
      this.chats=data
    },(error)=>{
      console.log(error);      
    })
  }
  checkSize():boolean{
    return window.innerWidth <= 500 ?  true :  false
  }

  showChat(chat:userChats){
    this.messageService.setSelectedMessageId(chat.latest_message_id)
    this.router.navigate([chat.name], {relativeTo:this.route});
    this.dataService.notifyOther({
      view:"chat",
      data:chat
    })
    if(this.checkSize())
      this.mobileViewEvent.emit(true)
  }
  clickChat(index:any){
    this.clickedIndex=index
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
          this.api.getReturn(`${environment.BASE_API_URL}/user/starredMessages/search`,{params:queryParams}).subscribe((data)=>{
            this.chats=data
          },(error)=>{
          console.log(error);      
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
    this.clickedIndex=undefined
    this.router.navigate(['starredMessages'], {relativeTo:this.route});
  }
  closeStarredMessage(){
    this.isStarredMessageOpened=false
    this.getUserChats()
    this.clickedIndex=undefined
    this.messageService.setSelectedMessageId(null)
    this.router.navigate(['/home']);
  }
  getStarredMessages(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/starredMessages`).subscribe((data)=>{
      this.chats=data
    },(error)=>console.log(error))
  }
}
