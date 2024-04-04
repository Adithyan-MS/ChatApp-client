import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { DatePipe } from '@angular/common';
import { User } from '../models/data-types';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  user:User

  constructor(private datePipe:DatePipe) { }

  setCurrentUser(currentUser : User){
    this.user = currentUser
  }

  getCurrentUser(){
    return this.user
  }
  
  HHMMFormatter(timestamp:string){
    const inputDate = new Date(timestamp);
    const options:any = { hour: '2-digit', minute: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(inputDate);
  }
  
  extractDate(timestamp: string): string {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, 'dd/MM/yy') || '';
  }
  
  DMonthYFormatter(timestamp:string){
    const date = new Date(timestamp);
    const options:any = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate; 
  }

  getImageUrl(name:string|any,image:string){
    return `${environment.BASE_API_URL}/image/view/${name}/${image}`
  }


  getMessageImageUrl(user:string|any,imageName:string|any):string{
    return `${environment.BASE_API_URL}/message/view/${user}/image/${imageName}`
  }

  getMessageVideoUrl(user:string|any,imageName:string|any):string{
    return `${environment.BASE_API_URL}/message/view/${user}/video/${imageName}`
  }

  getThumbnailUrl(user:string|any,imageName:string|any):string{
    return `${environment.BASE_API_URL}/message/view/${user}/thumbnail/${imageName}`
  }

  formatFileSize(bytes: number): string {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    if (bytes < kilobyte) {
        return bytes + ' B';
    } else if (bytes < megabyte) {
        return (bytes / kilobyte).toFixed(2) + ' KB';
    } else {
        return (bytes / megabyte).toFixed(2) + ' MB';
    }
  }
}
