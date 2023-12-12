import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersComponent } from './search-users/search-users.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResultComponent } from './search-users/user-result/user-result.component';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';
import { userSearch } from '../../../../models/data-types';
import { HttpHeaders } from '@angular/common/http';

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

  constructor(private fb:FormBuilder,private api: ApiService){}

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      name:['',[Validators.required]],
      desc:['']
    })
  }

  onItemsChanged(value:userSearch[]){
    this.members=value.map(obj => obj.id)
  }

  OnSubmit(){
    if(this.createRoomForm.invalid){
      return
    }
    const formdata = this.createRoomForm.getRawValue()
    const requestBody = {
      name:formdata.name,
      desc:formdata.desc,
      participants:this.members
    }
    console.log(requestBody);
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/room/createRoom`,requestBody,{headers}).subscribe((data)=>{
      //image upload
      console.log(data);      
    },(error)=>{
      console.log(error);      
    })
  }

}
