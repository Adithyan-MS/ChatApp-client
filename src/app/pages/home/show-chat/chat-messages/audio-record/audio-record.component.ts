import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-record.component.html',
  styleUrl: './audio-record.component.scss'
})
export class AudioRecordComponent implements OnInit{

  record:any
  recording:boolean = false
  url: any
  error: any

  constructor(private domSanitizer: DomSanitizer){}

  sanitize(url: string){
    return this.domSanitizer.bypassSecurityTrustUrl(url)
  }

  ngOnInit(): void {
    if (this.record) {
      return;
    }

    this.recording = true
    let mediaConstraints = {
       audio: true
    }
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this))
  }

  // startRecording(){}

  successCallback(stream:any){
    // var StereoAudioRecorder = RecordRTC.StereoAudioRecorder
    // this.record = new StereoAudioRecorder(stream, {
    //   type:"audio",
    //   mimeType: "audio/wav"
    // })
    // this.record.record()
  }

  stopRecording(){
    this.recording = false
    this.record.stop(this.processRecording.bind(this))
  }

  processRecording(blob:any){
    this.url = URL.createObjectURL(blob)
  }

  errorCallback(){
    console.log("Can't play audio in your browser");    
  }

}
