import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
      password:['',[Validators.required,Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]]
    })
  }

  onFormSubmit(form:FormGroup){
    console.log(form);
  }
}
