import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postReturn(apiUrl: string, requestBody: any | null, options?: any){
    return this.http.post<any>(apiUrl,requestBody,options)
  }

  getReturn(apiUrl: string, options?: any):Observable<any>{
    return this.http.get<any>(apiUrl,options)
  }
 
}
