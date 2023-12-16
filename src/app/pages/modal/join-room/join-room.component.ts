import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../models/data-types';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment.development';
import { RoomResultComponent } from './room-result/room-result.component';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [CommonModule,RoomResultComponent],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.scss'
})
export class JoinRoomComponent {
  
  @ViewChild("roomNameValue") roomNameValue:ElementRef

  room:Room|null
  searchFlag:boolean=false
  joinError:string
  @Output() successEvent = new EventEmitter<any>()

  constructor(private api:ApiService){}

  searchRoom(){
    const roomName = this.roomNameValue.nativeElement.value
    if(roomName!=''){
      this.searchFlag=true
      this.api.getReturn(`${environment.BASE_API_URL}/room/${roomName}`).subscribe((data:Room)=>{
        this.room = data
      },(error)=>{
        this.room = null        
      })
    }
    
  }
  getJoinReponse(event:any){
    if(event.status){
      this.successEvent.emit("success")
    }else{
      this.joinError = event.errorMessage
    }
  }

}
