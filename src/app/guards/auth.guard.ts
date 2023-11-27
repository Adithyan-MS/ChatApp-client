import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const authGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem("token")){
    return true;
  }else{
    const router = inject(Router)
    return router.navigate(['login'])
  }
};
