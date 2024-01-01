import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../models/data-types';
import { environment } from '../../../../../environments/environment.development';
import { AppService } from '../../../../services/app.service';
import { ApiService } from '../../../../services/api.service';
import { DataService } from '../../../../services/data.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-room-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-result.component.html',
  styleUrl: './room-result.component.scss'
})
export class RoomResultComponent implements OnInit{

  @Input() roomData:Room
  @Output() responseEvent = new EventEmitter<any>()
  roomPic:string
  errorMessage:string

  constructor(private appService:AppService,private api:ApiService,private dataService:DataService){ }

  ngOnInit(): void {
    if(this.roomData.room_pic){      
      this.roomPic = this.appService.getImageUrl(this.roomData.room_pic);
    }else{
      this.roomPic = environment.ROOM_IMAGE
    }
  }

  joinRoom(){
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/room/${this.roomData.id}/join`,null,{headers}).subscribe((data)=>{
      this.dataService.notifyOther({
        view:"chat",
        data:{
          type:"room",
          id:this.roomData.id,
          name:this.roomData.name,
          profile_pic:this.roomData.room_pic,
          max_modified_at:this.roomData.modifiedAt
        }
      })
      this.responseEvent.emit({
        status:true,
        message:"Join Success"
      })     
    },(error:any)=>{      
      this.errorMessage = JSON.parse(error["error"]).message;
      this.responseEvent.emit({
        status:false,
        message:this.errorMessage
      })      
    })
  }


}
