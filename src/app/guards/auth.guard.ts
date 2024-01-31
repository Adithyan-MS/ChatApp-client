import { ViewContainerRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
 
export const authGuard: CanActivateFn = (route, state) => {
  if(typeof localStorage !== 'undefined' && localStorage.getItem("token") && localStorage.getItem("user")){
    const token = localStorage.getItem("token")
    const expiry = (JSON.parse(atob(token!.split('.')[1]))).exp;
    // console.log(Math.floor((new Date).getTime() / 1000)+1780,expiry);
    
    if((Math.floor((new Date).getTime() / 1000)) >= expiry){
      console.log("expired");
      window.alert("Token Expired!")
      // showTokenExpiredModal()
      localStorage.clear()
      return redirectToLogin()
    }else{
      console.log("not expired");
      return true;
    }
  }else{
    console.log("no token or user");
    return redirectToLogin()
  }
};

const redirectToLogin = () => {
  const router = inject(Router);
  return router.navigate(['login']);
};

// const showTokenExpiredModal = () => {
//   const modalService = inject(ModalService);
//   const viewContainerRef = inject(ViewContainerRef);
//   modalService.setRootViewContainerRef(viewContainerRef);
//   modalService.addDynamicComponent('alert', null, 'Token Expired!');
// };