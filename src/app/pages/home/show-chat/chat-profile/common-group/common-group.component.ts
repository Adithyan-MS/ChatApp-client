import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';
import { DataService } from '../../../../../services/data-transfer/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../services/api/api.service';

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
  roomUsers:string
  roomUsersList:string[]

  constructor(private appService:AppService,private api:ApiService,private route:ActivatedRoute,private router:Router,private dataService: DataService){}

  ngOnInit(): void {
    this.roomPic = this.room.room_pic ? this.appService.getImageUrl(`room_${this.room.id}`,this.room.room_pic) : environment.ROOM_IMAGE
    this.api.getReturn(`${environment.BASE_API_URL}/room/${this.room.id}/userList`).subscribe((data)=>{
      this.roomUsers = data.join(', ')      
    },(error)=>{
      console.log(error)
    })
  }
  openRoomChat(){
    this.router.navigate([`${this.room.name}`], {relativeTo:this.route});
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
