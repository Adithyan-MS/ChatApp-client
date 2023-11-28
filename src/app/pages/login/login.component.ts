import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoginData } from './login-data';
import { AuthResponse } from '../../models/auth-response';
import { parse } from 'path';
import { environment } from '../../../environments/environment.development';
 
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
  
  constructor(private fb: FormBuilder,private api:ApiService,private router:Router){}
 
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
 
    const userData: LoginData={
      username:formValues.username,
      password:formValues.password
    }
   
    this.api.postReturn(`${environment.BASE_API_URL}/auth/login`,userData).subscribe((data:any)=>{
      this.loginSuccess = true;
      this.loginForm.reset();
      const jwtToken:string = data.token;
      localStorage.setItem("token",jwtToken)
      this.api.getReturn(`${environment.BASE_API_URL}/user/${userData.username}`).subscribe((data)=>{
        localStorage.setItem("user",JSON.stringify(data))        
        this.router.navigate(['home'])
      },(error)=>{
        this.errorMessage = error["error"].message;
        this.loginSuccess = false;
      })
    },(error)=>{
      this.errorMessage = error["error"].message;
      this.loginSuccess = false;
    })
    this.submitted = false;
  }
}