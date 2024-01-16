import { Component, EventEmitter, HostListener, OnInit, Output, ViewContainerRef } from '@angular/core';
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

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,ChatComponent,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations:[AnimationService.prototype.getItemMovementAnimation(),AnimationService.prototype.getVerticalMovementAnimation(),AnimationService.prototype.getDropdownAnimation()]
})
export class SidebarComponent implements OnInit{

  chats:userChats[]
  user:string|any
  userId:number
  clickedIndex?:number
  isStarredMessageOpened:boolean = false
  @Output() mobileViewEvent = new EventEmitter<any>()

  constructor(private api:ApiService,private router:Router,private route:ActivatedRoute,private dataService : DataService,private messageService:SenderService,private modalService: ModalService,private viewContainerRef: ViewContainerRef
    ){}

  ngOnInit(): void {
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
  getUserChats(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
      this.chats=data    
      console.log(this.chats);  
    },(error)=>{
      console.log(error);      
    })
  }
  checkSize():boolean{
    console.log(window.innerWidth);
    if (window.innerWidth <= 500) {
      return true
    }else{
      return false
    }
  }

  showChat(chat:userChats){
    this.router.navigate([chat.name], {relativeTo:this.route});
    this.dataService.notifyOther({
      view:"chat",
      data:chat
    })
    this.messageService.setSelectedMessageId(chat.latest_message_id)
    if(this.checkSize()){
      this.mobileViewEvent.emit(true)
    }
  }
  clickChat(index:any){
    this.clickedIndex=index
  }
  showCreateRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("createRoom",null)
  }
  showJoinRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("joinRoom")
  }

  onSearchChange(event:any){
      let searchName = event.target.value
      if(searchName !==""){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("name",searchName);
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
    this.router.navigate(['/home']);
  }
  getStarredMessages(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/starredMessages`).subscribe((data)=>{
      this.chats=data
    },(error)=>console.log(error))
  }
}
