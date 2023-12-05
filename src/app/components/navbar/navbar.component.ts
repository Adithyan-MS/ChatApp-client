import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../models/data-types';
import { AppService } from '../../services/app.service';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  username:string|null
  profilePic:string|null
  user:User | any
  constructor(private router: Router,private api:ApiService,private appService: AppService){
   
  }
 
  ngOnInit(): void {
    this.router.events.subscribe((value: any)=>{
      if(value.url){  
        if (typeof localStorage !== 'undefined') {
          if(localStorage.getItem("user")){
            this.user = localStorage.getItem("user");
            this.username = JSON.parse(this.user).name;
            this.profilePic = this.appService.getImageUrl(JSON.parse(this.user).profilePic,"user");
          }else{
            this.username=null
            this.profilePic=null
          }
        }       
      }
    })
   
  }
  userLogout(){
    const headers = new HttpHeaders().set('ResponseType', 'text');
    this.api.postReturn(`${environment.BASE_API_URL}/auth/logout`,null,{headers}).subscribe((data:any)=>{
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.router.navigate(["login"])
    },(error)=>{
      console.log(error);      
    })
  }
 
}