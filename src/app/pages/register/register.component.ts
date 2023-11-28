import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';
 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm:FormGroup;
 
  submitted:boolean = false;
  registerSuccess:boolean;
  errorMessage:string;
 
  constructor(private fb: FormBuilder,private api:ApiService,private router: Router){}
 
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      phonenumber:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
      password:['',[Validators.required,Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]],
      confirmPassword:['',[Validators.required]]
    })
  }
 
  onFormSubmit(){
 
    this.submitted = true;
 
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
 
    const formValues = this.registerForm.getRawValue();
 
    const userData: User={
      name: formValues.username,
      password: formValues.password,
      email: formValues.email,
      phone_number: formValues.phonenumber
    }
   
    this.api.postReturn(`${environment.BASE_API_URL}/auth/register`,userData).subscribe((data)=>{
      console.log(data);
      this.registerSuccess = true;
      this.registerForm.reset();
      this.router.navigate(['login'])
    },(error)=>{
      this.errorMessage = error["error"].message;
      this.registerSuccess = false;
    })
 
    this.submitted = false;
 
  }
 
}