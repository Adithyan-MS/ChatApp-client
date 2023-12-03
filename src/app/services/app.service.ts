import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  timestampFormatter(timestamp:string){
    const inputDate = new Date(timestamp);
    const options:any = { hour: '2-digit', minute: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(inputDate);
  }

  getImageUrl(image:string,type:string){
    return `${environment.BASE_API_URL}/${type}/image/${image}`
  }

}
