import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, LoginData, User } from '../../models/data-types';
 
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
   
    const apiUrl = "http://localhost:8080/chatApi/v1/auth/login"
   
    this.api.postReturn(apiUrl,userData).subscribe((data:AuthResponse)=>{
      console.log(data);
      this.loginSuccess = true;
      this.loginForm.reset();
      const jwtToken:string = data.token;
      localStorage.setItem("token",jwtToken)
      this.api.getReturn(`${environment.BASE_API_URL}/user/${userData.username}`).subscribe((data:User[])=>{
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