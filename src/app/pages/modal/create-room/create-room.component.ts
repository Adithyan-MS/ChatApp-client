import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room, User, userSearch } from '../../../models/data-types';
import { DataService } from '../../../services/data.service';
import { ApiService } from '../../../services/api.service';
import { AppService } from '../../../services/app.service';
import { ModalService } from '../../../services/modal.service';
import { environment } from '../../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { SearchUsersComponent } from './search-users/search-users.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AnimationService } from '../../../services/animation.service';
import { ClickOutsideDirective } from '../../../directives/clickOutside/click-outside.directive';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule,SearchUsersComponent,ClickOutsideDirective,ReactiveFormsModule,PickerComponent],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
  animations:[AnimationService.prototype.getDropdownAnimation()]
})
export class CreateRoomComponent {

  createRoomForm: FormGroup
  members:number[]=[]
  @Input() createWithUser: User|null
  @ViewChild('roomNameField') roomNameField :ElementRef
  submitted:boolean = false
  errorMessage:string|null = null
  createSuccess:boolean
  imageFile:File|null
  noRoomPic:string
  imageSrc:string|ArrayBuffer|null = null
  room:Room
  @Output() successEvent = new EventEmitter<any>()
  isEmojiOpened:boolean = false

  constructor(private fb:FormBuilder,private dataService: DataService,private api: ApiService,private appService:AppService,private modalService: ModalService){}

  roomPic:string|null

  ngOnInit(): void {    
    this.noRoomPic = environment.ROOM_IMAGE
    this.createRoomForm = this.fb.group({
      name:['',[Validators.required]],
      desc:['']
    })
  }

  onItemsChanged(value:userSearch[]){
    this.members=value.map(obj => obj.id)
  }

  OnSubmit(){
    this.submitted = true 
    console.log(this.members?.length);
       
    if(this.createRoomForm.invalid || this.members?.length==0){
      this.createRoomForm.markAllAsTouched();
      return
    }
    const formdata = this.createRoomForm.getRawValue()
    const requestBody = {
      name:formdata.name,
      desc:formdata.desc,
      participants:this.members
    }
    this.api.postReturn(`${environment.BASE_API_URL}/room/createRoom`,requestBody).subscribe((data:Room)=>{
      this.room = data
      this.createSuccess = true 
      this.successEvent.emit("success")    
      if(this.imageFile){
        let formParams = new FormData()
        formParams.append('file',this.imageFile)
        const headers = new HttpHeaders().set("ResponseType","text")
        this.api.postReturn(`${environment.BASE_API_URL}/image/upload/${this.room.id}`,formParams,{headers}).subscribe((data:string)=>{
          this.room.room_pic = data
          this.dataService.notifyOther({
            view:"chat",
            data:{
              type:"room",
              id:this.room.id,
              name:this.room.name,
              profile_pic:this.room.room_pic,
              max_modified_at:this.room.modifiedAt
            }
          })
        },(error)=>{
          console.log(error);
        })
      }else{
        this.dataService.notifyOther({
          view:"chat",
          data:{
            type:"room",
            id:this.room.id,
            name:this.room.name,
            profile_pic:null,
            max_modified_at:this.room.modifiedAt
          }
        })
      }
    },(error)=>{      
      this.errorMessage = error["error"].message;
      this.createSuccess = false    
    })
    this.submitted = false
  }

  onFileChange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.imageFile)
    }
  }
  toggleEmoji(){
    this.isEmojiOpened = !this.isEmojiOpened
  }

  clickedOutsideEmoji(){
    this.isEmojiOpened = false
  }
  addEmoji(event:any){
    const input = this.roomNameField.nativeElement;
    input.focus();
    if (document.execCommand){
      var event1 = new Event('input');
      document.execCommand('insertText', false, event.emoji.native);
      return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(event.emoji.native, start, end, 'end');
  }
}
