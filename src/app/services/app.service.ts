import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private datePipe:DatePipe) { }

  HHMMFormatter(timestamp:string){
    const inputDate = new Date(timestamp);
    const options:any = { hour: '2-digit', minute: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(inputDate);
  }

  DMonthYFormatter(timestamp:string){
    const date = new Date(timestamp);
    const options:any = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate; 
  }

  getImageUrl(image:string){
    return `${environment.BASE_API_URL}/image/view/${image}`
  }

  extractDate(timestamp: string): string {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'dd/MM/yy') || '';
  }

}
