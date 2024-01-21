import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../models/data-types';
import { AppService } from '../../services/app.service';
import { ClickOutsideDirective } from '../../directives/clickOutside/click-outside.directive';
import { AnimationService } from '../../services/animation.service';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations:[AnimationService.prototype.getDropdownAnimation()]
})
export class NavbarComponent implements OnInit{
  username:string|null
  userId: string|null
  profilePic:string|null
  user:User | any
  isMenuOpened:boolean
  constructor(private router: Router,private api:ApiService,private appService: AppService){
  }
 
  ngOnInit(): void {
    if (this.mobileSize()) {
      this.isMenuOpened = false;
    } else {
      this.isMenuOpened = true;
    }   
    this.router.events.subscribe((value: any)=>{
      if(value.url){  
        if (typeof localStorage !== 'undefined') {
          if(localStorage.getItem("user")){
            this.user = localStorage.getItem("user");
            this.username = JSON.parse(this.user).name;          
            this.userId = JSON.parse(this.user).id;          
            this.profilePic = JSON.parse(this.user).profilePic ? this.appService.getImageUrl(`user_${this.userId}`,JSON.parse(this.user).profilePic) : environment.USER_IMAGE
          }else{
            this.username=null
            this.profilePic=null
          }
        }       
      }
    })
  }
  
  @HostListener('window:resize', ['$event'])
  mobileSize():boolean {
      if(typeof window !== 'undefined' && window.innerWidth <= 500){
        this.isMenuOpened=false
        return true
      }else{
        this.isMenuOpened = true
        return false
      }
  }
  userLogout(){
    const headers = new HttpHeaders().set('ResponseType', 'text');
    this.api.postReturn(`${environment.BASE_API_URL}/auth/logout`,null,{headers}).subscribe((data:any)=>{
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.router.navigate(["login"])
    },(error)=>{
      console.log(error);      
    })
  }
  toggleMenu(){
    this.isMenuOpened = !this.isMenuOpened
  }
  clickedOutsideMenu(){
    if(window.innerWidth <= 500){
      this.isMenuOpened = false
    }
  }
}