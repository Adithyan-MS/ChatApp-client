import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../services/api.service';
import { userChats } from '../../../models/data-types';
import { DataService } from '../../../services/data.service';
import { HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,ChatComponent,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{

  chats:userChats[]

  constructor(private api:ApiService,private dataService : DataService){}

  ngOnInit(): void {    
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
    this.dataService.notifyOther({
      view:"createRoom",
      data:null
    })
  }
  showJoinRoom(){
    this.dataService.notifyOther({
      view:"joinRoom",
      data:null
    })
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
        this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
        this.chats=data
      },(error)=>{
        console.log(error);      
      })
    }
  }

}
