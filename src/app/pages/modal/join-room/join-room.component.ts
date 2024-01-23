import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
export class JoinRoomComponent implements OnInit{
  
  @ViewChild("roomCodeValue") roomCodeValue:ElementRef
  room:Room|null
  searchFlag:boolean=false
  joinError:string
  @Output() successEvent = new EventEmitter<any>()
  @Input() title:string

  constructor(private api:ApiService){}

  ngOnInit(): void {
    setTimeout(()=>this.setFieldFocus())
  }

  searchRoom(){
    const roomCode = this.roomCodeValue.nativeElement.value
    if(roomCode!=''){
      this.searchFlag=true
      this.api.getReturn(`${environment.BASE_API_URL}/room/roomCode/${roomCode}`).subscribe((data:Room)=>{
        this.room = data
      },(error)=>{
        this.room = null      
      })
    }
    
  }
  getJoinResponse(event:any){
    if(event.status){
      this.successEvent.emit("success")
    }else{
      this.joinError = event.message
    }
  }

  setFieldFocus(){
    if(this.roomCodeValue){
      this.roomCodeValue.nativeElement.focus()
    }
  }

}
