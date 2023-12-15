import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomResultComponent } from './room-result/room-result.component';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';
import { Room } from '../../../../models/data-types';

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
  getErrorMessage(event:any){
    this.joinError=event
  }

}
