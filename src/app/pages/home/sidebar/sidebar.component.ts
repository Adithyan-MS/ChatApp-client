import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../services/api.service';
import { userChats } from '../../../models/data-types';
import { DataService } from '../../../services/data.service';
import { HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,ChatComponent,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{

  chats:userChats[]
  user:string|any
  userId:number

  constructor(private api:ApiService,private dataService : DataService,private modalService: ModalService,private viewContainerRef: ViewContainerRef
    ){}

  ngOnInit(): void {    
    if(typeof localStorage != undefined){
      this.user = localStorage.getItem("user");
      this.userId = JSON.parse(this.user).id; 
    }
    this.getUserChats()    
    this.dataService.notifyObservable$.subscribe((data)=>{
      if(data){
        this.getUserChats()
      }
    })
  }
  getUserChats(){
    this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
      this.chats=data      
    },(error)=>{
      console.log(error);      
    })
  }

  showChat(chat:userChats){
    this.dataService.notifyOther({
      view:"chat",
      data:chat
    })
  }
  showCreateRoom(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("createRoom")
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
        this.api.getReturn(`${environment.BASE_API_URL}/user/search`,{params:queryParams}).subscribe((data)=>{
        this.chats=data
      },(error)=>{
        console.log(error);      
      })
      }else{
        this.getUserChats()
    }
  }
  showStarredMessage(){
    
  }

}
