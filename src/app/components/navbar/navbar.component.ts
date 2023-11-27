import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment.development';
import { error } from 'console';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  username:string
  profilePic:string
  user:User | any
  constructor(private router: Router,private api:ApiService){
    
  }
  
  ngOnInit(): void {
    this.user = localStorage.getItem("user");
    console.log(this.user);
    
    this.username = JSON.parse(this.user).name;
  }
  userLogout(){
    this.api.postReturn(`${environment.BASE_API_URL}/auth/logout`,null).subscribe((data)=>{
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.router.navigate(["login"])
    },(error)=>{
      console.log(error);
      
    })
  }
  
}
