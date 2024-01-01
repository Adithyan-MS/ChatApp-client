import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { inject } from '@angular/core';
import { ChatMessagesComponent } from './pages/home/show-chat/chat-messages/chat-messages.component';
import { ChatProfileComponent } from './pages/home/show-chat/chat-profile/chat-profile.component';
import { SidebarComponent } from './pages/home/sidebar/sidebar.component';

export const routes: Routes = [
    {
        path:"login",
        component:LoginComponent,
        title:"Login | ChatApp",
        canActivate:[()=>{
            if(typeof localStorage !== 'undefined' && localStorage.getItem("token") && localStorage.getItem("user")){
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
            if(typeof localStorage !== 'undefined' && localStorage.getItem("token") && localStorage.getItem("user")){
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
        canActivate:[authGuard],
        children:[
            {
                path:':chat',
                component:ChatMessagesComponent,
                children:[
                    {
                        path:'profile',
                        component:ChatProfileComponent
                    }
                ]
            },
            {
                path:'starredMessages',
                component:SidebarComponent
            }
        ]
    },
    {
        path:"profile",
        component:ProfileComponent,
        title:"Profile | ChatApp",
        canActivate:[authGuard]
    }
];
