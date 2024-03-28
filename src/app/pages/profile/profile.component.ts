import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
import { ModalService } from '../../services/modal.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../../directives/clickOutside/click-outside.directive';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ProfileSidebarComponent,ProfileViewContentComponent,ReactiveFormsModule,PickerComponent,ClickOutsideDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  animations:[AnimationService.prototype.getDropdownAnimation()]
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
  @ViewChild("bioEditSpan") bioEditSpan:ElementRef
  maxContentLength = 200; 
  bioForm:FormGroup
  isEmojiOpened:boolean = false

  constructor(private api:ApiService,private appService:AppService,private router:Router,private fb:FormBuilder,private viewContainerRef: ViewContainerRef, private modalService:ModalService){}

  ngOnInit(): void {
    this.bioForm = this.fb.group({
      bio:['',[Validators.required]]
    })

    if(typeof localStorage !== "undefined"){
      this.data = localStorage.getItem("user");
      if(this.data){
        this.currentUser = JSON.parse(this.data)
        this.profilePic = this.currentUser.profilePic ? this.appService.getImageUrl(`user_${this.currentUser.id}`,this.currentUser.profilePic) : environment.USER_IMAGE
        this.userBio = this.currentUser.bio ? this.currentUser.bio : "Hey! I am using ChatApp"
      }
    }
  }

  onFilechange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      this.modalService.setRootViewContainerRef(this.viewContainerRef)
      this.modalService.addDynamicComponent('handleImage','profilePic',event).then((value)=>{
        if(value){
          let formParams = new FormData();
          formParams.append('file',value);
          const headers = new HttpHeaders().set("ResponseType","text")
          this.api.postReturn(`${environment.BASE_API_URL}/image/upload`,formParams,{headers}).subscribe((data)=>{
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
        }
      }).catch((error)=>{
        console.log(error);
    });
      
    }
  }

  viewBioEdit(){
    setTimeout(()=>{
      this.bioEditSpan.nativeElement.innerText = this.userBio
      this.bioEditSpan.nativeElement.focus()
      this.moveCursorToEnd() 
      this.onBioInput()
    })
    this.editBioFlag=true
  }

  cancelBioEdit(){
    this.editBioFlag=false
  }

  onBioInput(){
      let newValue = this.bioEditSpan.nativeElement.innerText;
      if (newValue.length > this.maxContentLength) {
        newValue = newValue.slice(0, this.maxContentLength);
        this.bioEditSpan.nativeElement.innerText = newValue;
        this.moveCursorToEnd()
        this.modalService.setRootViewContainerRef(this.viewContainerRef)
        this.modalService.addDynamicComponent("alert",null,"Bio cannot be greater than 200 characters.")
        this.bioEditSpan.nativeElement.blur();
      }
      this.bioForm.patchValue({ bio: newValue });
  }

  updateBio(){
    const formdata = this.bioForm.getRawValue();
    if(formdata.bio != this.userBio){
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/user/update/bio`,formdata,{headers}).subscribe((data)=>{
        if(typeof localStorage != null){
          this.newUserDetails = localStorage.getItem("user");
          this.newUserDetails = JSON.parse(this.newUserDetails);
          this.newUserDetails.bio = data
          localStorage.removeItem("user")
          localStorage.setItem("user",JSON.stringify(this.newUserDetails))       
          this.ngOnInit()  
        }
      },(error)=>{
        console.log(error);      
      })
    }
    this.editBioFlag=false
  }

  moveCursorToEnd() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(this.bioEditSpan.nativeElement);
    range.collapse(false); 
    if(selection){
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  viewImage(){
    this.modalService.setRootViewContainerRef(this.viewContainerRef)
    this.modalService.addDynamicComponent("viewImage",null,this.profilePic)
  }

  toggleEmoji(){
    this.isEmojiOpened = !this.isEmojiOpened
  }
  clickedOutsideEmoji(){
    this.isEmojiOpened = false
  }
  addEmoji(event:any){
    const input = this.bioEditSpan.nativeElement;
    this.moveCursorToEnd()
    if (document.execCommand){
      var event1 = new Event('input');
      document.execCommand('insertText', false, event.emoji.native);
      return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(event.emoji.native, start, end, 'end');
  }
  
}
