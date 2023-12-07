import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { type } from 'os';
import { User } from '../../models/data-types';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  currentUser:User
  data:string|null
  profilePic:string

  constructor(private api:ApiService,private appService:AppService){}

  ngOnInit(): void {
    if(typeof localStorage !== "undefined"){
      this.data = localStorage.getItem("user");
      if(this.data){
        this.currentUser = JSON.parse(this.data)
        this.profilePic = this.appService.getImageUrl(JSON.parse(this.data).profilePic,"user");
      }
    }
  }

}
