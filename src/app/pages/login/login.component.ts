import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;
 
  submitted:boolean = false;
  loginSuccess:boolean;
  errorMessage:string;
  
  constructor(private fb: FormBuilder,private api:ApiService){}
 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
      password:['',[Validators.required,Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]]
    })
  }
  onFormSubmit(){
 
    this.submitted = true;
 
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
 
    const formValues = this.loginForm.getRawValue();
 
    const userData={
      username:formValues.username,
      password:formValues.password
    }
   
    const apiUrl = "http://localhost:8080/chatApi/v1/auth/login"
   
    this.api.postReturn(apiUrl,userData).subscribe((data)=>{
      console.log(data);
      this.loginSuccess = true;
      this.loginForm.reset();
    },(error)=>{
      // this.errorMessage = error["error"].message;
      this.errorMessage = "Invalid Username or Password!";
      this.loginSuccess = false;
    })

    this.submitted = false;
  }
}