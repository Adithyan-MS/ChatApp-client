import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { message, userChats } from '../../../../../models/data-types';
import { ApiService } from '../../../../../services/api.service';
import { environment } from '../../../../../../environments/environment.development';
import { error } from 'console';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../../../services/app.service';

@Component({
  selector: 'app-send-file',
  standalone: true,
  imports: [CommonModule,ImageCropperModule],
  templateUrl: './send-file.component.html',
  styleUrl: './send-file.component.scss'
})
export class SendFileComponent implements OnInit{
  @Input()isFileTypeImage:boolean=true  
  @Output() closeSendFileEvent = new EventEmitter<any>()
  @Input() files:any[]
  @Input() documents:any[]
  @Input() selectedFiles:File[]=[]
  @Input() parentMessage:message|null
  @Input() currentChat:userChats
  @Output() fileSendSuccessEvent = new EventEmitter<any>()

  constructor(private api:ApiService,private appService:AppService){}

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
    if(this.files.length!=0){
      const messageRequest = {
        message:{
          content:"file",
          type:this.isFileTypeImage ? "image" : "document",
          parentMessage: this.parentMessage!=null ? this.parentMessage?.id : null
        },
        receiver:{
          type:this.currentChat.type,
          id:this.currentChat.id
        }
      }
      let formData: FormData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
      formData.append('messageData', JSON.stringify(messageRequest));
      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/message/sendFile`,formData,{headers}).subscribe((data)=>{
        console.log(data);
        this.fileSendSuccessEvent.emit(true)
      },(error)=>{
        console.log(error);
      })
      this.selectedFiles = []
    }
  }
}
