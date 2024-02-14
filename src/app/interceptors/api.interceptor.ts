import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem("token");
  
  if (token) {
    if (req.headers.get('ResponseType') === 'text') {
      const authReq = req.clone({
        responseType: 'text',
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
      return next(authReq);
    }else if(req.headers.get('ResponseType') === 'text' && req.headers.get('reportProgress') == 'true'){
      const authReq = req.clone({
        responseType: 'text',
        reportProgress:true,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
      return next(authReq);
    }
    else{
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
      return next(authReq);
    }
  }
  return next(req);
};
