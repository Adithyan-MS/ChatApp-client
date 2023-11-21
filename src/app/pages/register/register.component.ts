import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm:FormGroup;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username:['',[Validators.required,Validators.maxLength(15),Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      phonenumber:['',[Validators.required,Validators.pattern]],
      password:['',[Validators.required,Validators.minLength(4)]],
      confirmPassword:['',[Validators.required,Validators.minLength(4)]]
    })
  }

  onFormSubmit(form:FormGroup){
    console.log(form);

  }

}
