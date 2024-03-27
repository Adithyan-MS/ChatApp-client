import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-handler',
  standalone: true,
  imports: [CommonModule,ImageCropperModule],
  templateUrl: './image-handler.component.html',
  styleUrl: './image-handler.component.scss'
})
export class ImageHandlerComponent implements OnInit{

  @Input() image:any
  @Output() doneEvent = new EventEmitter<any>()
  @Output() cancelEvent = new EventEmitter<any>()
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedBlob:any

  constructor(private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    console.log(this.image);
  }


  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: any) {
    this.croppedBlob = event.blob
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);    
  }
  imageLoaded(image: LoadedImage) { 
  }
  cropperReady() {
  }
  loadImageFailed() {
  }

  done() {
    var file = new File([this.croppedBlob],"profilePic",{ type: this.croppedBlob.type });
    this.doneEvent.emit(file)
  }
  
  cancel() {
    this.cancelEvent.emit(false)
  }
 
}
