import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersComponent } from './search-users/search-users.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResultComponent } from './search-users/user-result/user-result.component';
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule,SearchUsersComponent,ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent implements OnInit{

  createRoomForm: FormGroup

  constructor(private fb:FormBuilder,private api: ApiService){}

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      name:['',[Validators.required]],
      desc:['']
    })
  }

  OnSubmit(){
    const formdata = this.createRoomForm.getRawValue()
    const requestBody = {
      name:formdata.name,
      desc:formdata.desc,
      participants:[]
    }
    this.api.postReturn(`${environment.BASE_API_URL}/room/createRoom`,requestBody).subscribe((data)=>{
      console.log(data);      
    },(error)=>{
      console.log(error);      
    })
  }

}
