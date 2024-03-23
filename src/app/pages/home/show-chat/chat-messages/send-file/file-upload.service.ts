import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().set("ResponseType","text").set("Reportprogress","true").set("observe","events")
    const req = new HttpRequest('POST', `${environment.BASE_API_URL}/message/sendFile`, formData, {headers});   
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
