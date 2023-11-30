import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
 
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
  constructor(private router: Router,private api:ApiService){
   
  }
 
  ngOnInit(): void {
    this.router.events.subscribe((value: any)=>{
      if(value.url){        
        if(localStorage.getItem("user")){
          this.user = localStorage.getItem("user");
          this.username = JSON.parse(this.user).name;
          this.profilePic = `${environment.BASE_API_URL}/user/image/${JSON.parse(this.user).profilePic}`;
        }else{
          this.username=null
          this.profilePic=null
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