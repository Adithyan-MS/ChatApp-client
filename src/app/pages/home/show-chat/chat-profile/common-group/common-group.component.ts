import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-common-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-group.component.html',
  styleUrl: './common-group.component.scss'
})
export class CommonGroupComponent implements OnInit{

  @Input() room:Room
  roomPic:string

  constructor(private appService:AppService,private dataService: DataService){}

  ngOnInit(): void {
    if(this.room.room_pic){
      this.roomPic = this.appService.getImageUrl(this.room.room_pic)
    }else{
      this.roomPic=environment.ROOM_IMAGE
    }
  }
  openRoomChat(){
    this.dataService.notifyOther({
      view:"chat",
      data:{
        type:"room",
        id:this.room.id,
        name:this.room.name,
        profile_pic:this.room.room_pic,
        max_modified_at:null
      }
    })
  }

}
