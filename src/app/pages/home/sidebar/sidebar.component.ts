import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../services/api.service';
import { userChats } from '../../../models/data-types';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,ChatComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{

  chats:userChats[]

  constructor(private api:ApiService,private dataService : DataService){}

  ngOnInit(): void {
    this.api.getReturn(`${environment.BASE_API_URL}/user/chats`).subscribe((data:userChats[])=>{
      this.chats=data
      console.log(this.chats);
      
  },(error)=>{
      console.log(error);
      
  })
  }
  showChat(chat:userChats){
    this.dataService.notifyOther({chat})
  }

}
