import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { message, userChats } from '../../../../../models/data-types';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppService } from '../../../../../services/app.service';
import { FileUploadService } from './file-upload.service';
import { catchError, map, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-send-file',
  standalone: true,
  imports: [CommonModule,ImageCropperModule],
  templateUrl: './send-file.component.html',
  styleUrl: './send-file.component.scss'
})
export class SendFileComponent implements OnInit{
  @Input()fileType:string
  @Output() closeSendFileEvent = new EventEmitter<any>()
  @Input() files:any[]
  @Input() documents:any[]
  @Input() selectedFiles:File[]=[]
  @Input() parentMessage:message|null
  @Input() currentChat:userChats
  @Output() fileSendSuccessEvent = new EventEmitter<any>()
  progress:any

  constructor(private api:ApiService,private appService:AppService, private fileUploadService: FileUploadService){}

  ngOnInit(): void {
  }
  
  closeSendFile(){
    this.closeSendFileEvent.emit(true)
  }
  onFilechange(event:any){
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.files.push({
          file:e.target.result,
          type:file.type,
          name:file["name"],
          size:this.appService.formatFileSize(file.size)
        });
      };
      reader.readAsDataURL(file);
    }

  }
  removeFile(index:number){
    this.files.splice(index,1)
    if(this.files.length==0)
      this.closeSendFile()
  }
  sendFile(){
    this.progress = 1
    if(this.files.length!=0){
      const messageRequest = {
        message:{
          content:"file",
          type:this.fileType,
          parentMessage: this.parentMessage!=null ? this.parentMessage?.id : null
        },
        receiver:{
          type:this.currentChat.type,
          id:this.currentChat.id
        }
      }
      let formData: FormData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('file', this.selectedFiles[i]);
        formData.append('messageData', JSON.stringify(messageRequest));
        this.fileUploadService.upload(formData).pipe(
          map((event: any) => {                 
            if (event.type == HttpEventType.UploadProgress) {              
              this.progress = Math.round((100 / event.total) * event.loaded);
              console.log(this.progress);              
            } else if (event.type == HttpEventType.Response) {
              this.progress = null;
            }
          }),
          catchError((err: any) => {
            this.progress = null;
            alert(err.message);
            return throwError(err.message);
          })
        )
        .toPromise();
      }
      this.fileSendSuccessEvent.emit(true)
      this.selectedFiles = []
      
    }
  }
}
