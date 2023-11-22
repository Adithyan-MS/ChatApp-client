import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';

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

  constructor(private fb: FormBuilder,private api:ApiService){}

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
      this.registerForm.markAllAsTouched;
      return;
    }

    const formValues = this.registerForm.getRawValue();

    const userData={
      name:formValues.username,
      password:formValues.password,
      email:formValues.email,
      phone_number:formValues.phonenumber
    }

    const apiUrl = "http://localhost:8080/chatApi/v1/auth/register"
    
    this.api.postReturn(apiUrl,userData).subscribe((data)=>{
      console.log(data);
    },(error)=>{
      console.log(error["error"]);
    })

    this.submitted = false;

  }

}
