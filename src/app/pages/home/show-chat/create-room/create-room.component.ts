import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersComponent } from './search-users/search-users.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResultComponent } from './search-users/user-result/user-result.component';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule,SearchUsersComponent,ReactiveFormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent implements OnInit{

  createRoomForm: FormGroup

  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      name:['',[Validators.required]],
      desc:[''],
      participants:[[]]
    })
  }

  OnSubmit(){

  }

}
