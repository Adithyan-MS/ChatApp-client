import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersComponent } from './search-users/search-users.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';
import { Room, userSearch } from '../../../../models/data-types';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../../services/app.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule,SearchUsersComponent,ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent implements OnInit{

  createRoomForm: FormGroup
  members:number[]
  submitted:boolean = false
  errorMessage:string|null = null
  createSuccess:boolean
  imageFile:File|null
  noRoomPic:string
  imageSrc:string|ArrayBuffer|null = null
  room:Room
  @Output() cancelEvent = new EventEmitter<any>();
  @Output() successEvent = new EventEmitter<any>();

  constructor(private fb:FormBuilder,private dataService: DataService,private api: ApiService,private appService:AppService){}

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
    this.api.postReturn(`${environment.BASE_API_URL}/room/createRoom`,requestBody).subscribe((data)=>{
      this.room = data
      console.log(data);
      
      if(this.imageFile){
        let formParams = new FormData()
        formParams.append('file',this.imageFile)
        const headers = new HttpHeaders().set("Response","text")
        this.api.postReturn(`${environment.BASE_API_URL}/image/upload/${this.room.id}`,formParams,{headers}).subscribe((data)=>{
          this.roomPic = data
        },(error)=>{
          console.log(error);
        })
      }
      this.createSuccess = true   
      this.dataService.notifyOther({
        view:"chat",
        data:{
          type:"room",
          id:this.room.id,
          name:this.room.name,
          profile_pic:this.roomPic,
          max_modified_at:this.room.modifiedAt
        }
      })
    },(error)=>{
      this.errorMessage = JSON.parse(error["error"]).message;
      this.createSuccess = false    
    })
    this.submitted = false
  }

  onFileChange(event:any){
    this.imageFile = event.target.files[0]
    if(this.imageFile){
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.imageFile);
      console.log(this.imageFile);
    }
  }
  cancelRoomCreate(){
    this.cancelEvent.emit("chat")
  }

}
