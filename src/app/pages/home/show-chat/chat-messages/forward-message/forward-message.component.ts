import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchChatComponent } from './search-chat/search-chat.component';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { error } from 'console';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-forward-message',
  standalone: true,
  imports: [CommonModule,SearchChatComponent],
  templateUrl: './forward-message.component.html',
  styleUrl: './forward-message.component.scss'
})
export class ForwardMessageComponent {

  searchResult:any[]=[]
  selectedChats:any[]=[]

  constructor(private api:ApiService){}

  searchChats(event:any){
    let searchName = event.target.value
    if(searchName!=''){
      let queryParams = new HttpParams();
      queryParams = queryParams.append("value",searchName);    
      this.api.getReturn(`${environment.BASE_API_URL}/message/forward/search`,{params:queryParams}).subscribe((data)=>{
        console.log(data);     
        this.searchResult = data 
      },(error)=>console.log(error))
    }
  }

  getSelectedChat(chat:any) {
    this.selectedChats.push(chat)
    // this.itemsChanged.emit(this.selectedChats)   
  }
  
  isChatSelected(chat:any){
    if(this.selectedChats.includes(chat)){
      return false;
    }else{
      return true;
    }
  }
  
  removeChat(chat:any){
    this.selectedChats = this.selectedChats.filter(obj => {
      return obj !== chat
    });
  }
  forwardMessage(){

  }
}
