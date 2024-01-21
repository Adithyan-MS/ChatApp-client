import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, userSearch } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-user-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-result.component.html',
  styleUrl: './user-result.component.scss'
})
export class UserResultComponent implements OnInit{
  @Input() user:userSearch
  @Output() eventEmitter = new EventEmitter<any>()

  userPic:string
  
  constructor(private appService:AppService){
  }

  ngOnInit(): void { 
    this.userPic = this.user.profile_pic ? this.appService.getImageUrl(`user_${this.user.id}`,this.user.profile_pic) : environment.USER_IMAGE
  }

  selectedUser(user: userSearch){
      this.eventEmitter.emit(user)
  }


}
