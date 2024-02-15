import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { message, userChats } from '../../../../../models/data-types';
import { ApiService } from '../../../../../services/api.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AppService } from '../../../../../services/app.service';
import { FileUploadService } from './file-upload.service';

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
  message:string = ''

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
          size:this.appService.formatFileSize(file.size),
          progress:null
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
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.files[i].progress = 1 
        let formData: FormData = new FormData();
        formData.append('file', this.selectedFiles[i]);
        formData.append('messageData', JSON.stringify(messageRequest));
        this.fileUploadService.upload(formData).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.files[i].progress = Math.round((100 * event.loaded) / event.total);
              console.log(this.files[i].progress,this.files[i].size);              
            } else if (event instanceof HttpResponse) {
              // this.files[i].progress = null              
            }
          },
          error: (err: any) => {
            console.log(err);  
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.files[i].progress = null
          },
          complete: () => {
            console.log("completed!! ",i);
            // this.files.splice(i,1)
            console.log(this.files);
            
            // if(this.files.length==0){
            //   this.selectedFiles = []                
            //   this.fileSendSuccessEvent.emit(true)
            //   console.log('finishED!!');          
            // }
          }
        });
      }     
    }
  }
}
