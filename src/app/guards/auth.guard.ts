import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const authGuard: CanActivateFn = (route, state) => {

  if(localStorage.getItem("token") && localStorage.getItem("token")){
    console.log("in guard");
    return true;
  }
    const router = inject(Router)
    return router.navigate(['/']);
  
};
