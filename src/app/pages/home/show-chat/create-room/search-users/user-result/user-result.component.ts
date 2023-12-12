import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../../models/data-types';
import { AppService } from '../../../../../../services/app.service';
import { environment } from '../../../../../../../environments/environment.development';

@Component({
  selector: 'app-user-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-result.component.html',
  styleUrl: './user-result.component.scss'
})
export class UserResultComponent implements OnInit{
  @Input() user:any
  @Output() eventEmitter = new EventEmitter<any>()

  userPic:string
  
  constructor(private appService:AppService){
  }

  ngOnInit(): void { 
    if(this.user.profile_pic){
      this.userPic = this.appService.getImageUrl(this.user.profile_pic,"user");
    }else{
      this.userPic = environment.USER_IMAGE
    }
  }

  selectedUser(user: any){
      this.eventEmitter.emit(user)
  }


}
