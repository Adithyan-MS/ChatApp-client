import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/data-types';
import { AppService } from '../../services/app.service';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileViewContentComponent } from './profile-view-content/profile-view-content.component';
import { environment } from '../../../environments/environment.development';
import { Router, RouterModule } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ProfileSidebarComponent,ProfileViewContentComponent,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  currentUser:User
  data:string|null
  profilePic:string
  imageFile:File|null
  newFileName:string
  newUserDetails:User|any
  userBio:string
  editBioFlag:boolean=false

  bioForm:FormGroup

  constructor(private api:ApiService,private appService:AppService,private router:Router,private fb:FormBuilder){}

  ngOnInit(): void {
    this.bioForm = this.fb.group({
      bio:['',[Validators.required]]
    })

    if(typeof localStorage !== "undefined"){
      this.data = localStorage.getItem("user");
      if(this.data){
        this.currentUser = JSON.parse(this.data)
        if(this.currentUser.profilePic!=null){
          this.profilePic = this.appService.getImageUrl(this.currentUser.profilePic,"user");
        }else{
          this.profilePic = environment.USER_IMAGE
        }
        if(this.currentUser.bio){
          this.userBio = this.currentUser.bio
        }else{
          this.userBio = "Hey! I am using ChatApp"
        }
      }
    }
  }

  onFilechange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      let formParams = new FormData();
      formParams.append('file',this.imageFile);
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/user/update/picture`,formParams,{headers}).subscribe((data)=>{
        if(typeof localStorage != null){
          this.newUserDetails = localStorage.getItem("user");
          this.newUserDetails = JSON.parse(this.newUserDetails);
          this.newUserDetails.profilePic = data
          localStorage.removeItem("user")
          localStorage.setItem("user",JSON.stringify(this.newUserDetails))       
          this.ngOnInit()
          this.router.navigate(['/profile'])           
         }
      },(error)=>{
        console.log(error);        
      })
    }else{

    }
  }

  viewBioEdit(){
    this.editBioFlag=true
  }
  cancelBioEdit(){
    this.editBioFlag=false
  }

  updateBio(){
    const formdata = this.bioForm.getRawValue();
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/user/update/bio`,formdata,{headers}).subscribe((data)=>{
      if(typeof localStorage != null){
        this.newUserDetails = localStorage.getItem("user");
        this.newUserDetails = JSON.parse(this.newUserDetails);
        this.newUserDetails.bio = data
        localStorage.removeItem("user")
        localStorage.setItem("user",JSON.stringify(this.newUserDetails))       
        this.ngOnInit()          
        this.editBioFlag=false
       }
    },(error)=>{
      console.log(error);      
    })
  }

}
