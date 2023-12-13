import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';

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

  constructor(private appService:AppService){}

  ngOnInit(): void {
    if(this.room.room_pic){
      this.roomPic = this.appService.getImageUrl(this.room.room_pic)
    }else{
      this.roomPic=environment.ROOM_IMAGE
    }
  }

}
