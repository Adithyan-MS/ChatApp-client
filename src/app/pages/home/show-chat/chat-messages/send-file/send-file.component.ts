import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'app-send-file',
  standalone: true,
  imports: [CommonModule,ImageCropperModule],
  templateUrl: './send-file.component.html',
  styleUrl: './send-file.component.scss'
})
export class SendFileComponent implements OnInit{

  ngOnInit(): void {
  }

  @Output() closeSendFileEvent = new EventEmitter<any>()
  @Input() images:any[]
  @Input() documents:any[]
  selectedFiles:File[]=[]

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
        this.images.push({
          file:e.target.result,
          type:file.type,
          name:file["name"],
          size:file.size
        });
      };
      reader.readAsDataURL(file);
    }

  }
  removeFile(index:number){
    this.images.splice(index,1)
    if(this.images.length==0)
      this.closeSendFile()
  }
  sendFile(){
    
  }
}
