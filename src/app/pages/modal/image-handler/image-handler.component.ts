import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform, LoadedImage } from 'ngx-image-cropper';
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
  @Input() title:any
  @Output() doneEvent = new EventEmitter<any>()
  @Output() cancelEvent = new EventEmitter<any>()
  imageChangedEvent: any = '';
  croppedImage: any = '';
  newImage:any
  canvasRotation = 0
  transform : ImageTransform = {}

  constructor(private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    console.log(this.image);
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }

  imageCropped(event: any) {    
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);    
    this.newImage = new File([event.blob],this.title+".png",{ type: event.type });
  }

  imageLoaded(image: LoadedImage) { 
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  done() {
    this.doneEvent.emit(this.newImage)
  }
  
  cancel() {
    this.cancelEvent.emit(false)
  }
 
}
