import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { inject } from '@angular/core';

export const routes: Routes = [
    {
        path:"login",
        component:LoginComponent,
        title:"Login | ChatApp",
        canActivate:[()=>{
            if(localStorage.getItem("token") && localStorage.getItem("user")){
                const router = inject(Router)
                return router.navigate(['home']);
              }else{
                return true;
              }
        }]
    },
    {
        path:"register",
        component:RegisterComponent,
        title:"Register | ChatApp",
        canActivate:[()=>{
            if(localStorage.getItem("token") && localStorage.getItem("user")){
                const router = inject(Router)
                return router.navigate(['home']);
              }else{
                return true;
              }
        }]
    },
    {
        path:"home",
        component:HomeComponent,
        title:"Home | ChatApp",
        canActivate:[authGuard]
    },
    {
        path:"profile",
        component:ProfileComponent,
        title:"Profile | ChatApp",
        canActivate:[authGuard]
    }
];
