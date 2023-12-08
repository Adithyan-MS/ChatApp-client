import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant } from '../../../../../models/data-types';
import { AppService } from '../../../../../services/app.service';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss'
})
export class ParticipantComponent implements OnInit{

  @Input() member:Participant
  memberPic:string|null

  constructor(private appService: AppService){}

  ngOnInit(): void {
    if(this.member.profile_pic){
      this.memberPic=this.appService.getImageUrl(this.member.profile_pic,"user")
    }else{
      this.memberPic = environment.USER_IMAGE
    }
  }

}
