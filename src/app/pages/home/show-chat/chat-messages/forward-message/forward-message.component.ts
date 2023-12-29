import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchChatComponent } from './search-chat/search-chat.component';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
import { chatSearch, receiver } from '../../../../../models/data-types';

@Component({
  selector: 'app-forward-message',
  standalone: true,
  imports: [CommonModule,SearchChatComponent],
  templateUrl: './forward-message.component.html',
  styleUrl: './forward-message.component.scss'
})
export class ForwardMessageComponent implements OnInit{

  searchResult:chatSearch[]=[]
  selectedChats:chatSearch[]=[]
  receiversList:receiver[]=[]
  @Output() forwardSubmitEvent = new EventEmitter<any>()
  @Output() forwardCancelEvent = new EventEmitter<any>()
  @ViewChild("forwardSearch") forwardSearch :ElementRef

  constructor(private api:ApiService, private elementRef:ElementRef){}

  ngOnInit(): void {
    setTimeout(()=>this.setSendFieldFocus())
  }

  setSendFieldFocus(){
    if(this.forwardSearch){
      this.forwardSearch.nativeElement.focus()
    }
  }
  
  searchChats(event:any){
    let searchName = event.target.value
    if(searchName!=''){
      let queryParams = new HttpParams();
      queryParams = queryParams.append("value",searchName);    
      this.api.getReturn(`${environment.BASE_API_URL}/message/forward/search`,{params:queryParams}).subscribe((data:chatSearch[])=>{
        this.searchResult = data 
      },(error)=>console.log(error))
    }
  }
  getSelectedChat(chat:chatSearch) {
    this.selectedChats.push(chat)
  }  
  isChatSelected(chat:chatSearch){
    if(this.selectedChats.includes(chat)){
      return false;
    }else{
      return true;
    }
  }  
  removeChat(chat:chatSearch){
    this.selectedChats = this.selectedChats.filter(obj => {
      return obj !== chat
    });
  }
  forwardMessage(){
    if(this.selectedChats.length!=0){
      this.selectedChats.map((value)=>{
        this.receiversList.push({
          type:value.type,
          id:value.id
        })
      })
      this.forwardSubmitEvent.emit(this.receiversList)
    }
  }
  cancelForward(){
    this.receiversList=[]
    this.forwardCancelEvent.emit(true)
  }
}
