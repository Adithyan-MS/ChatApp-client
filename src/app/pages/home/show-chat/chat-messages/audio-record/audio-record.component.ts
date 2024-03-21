import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioRecordingService } from './audio-recording.service';

@Component({
  selector: 'app-audio-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-record.component.html',
  styleUrl: './audio-record.component.scss'
})
export class AudioRecordComponent implements OnInit, OnDestroy{

  isRecording = false;
  recordedTime:string
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @Output() audioStatusEvent = new EventEmitter<any>()

  constructor(private audioRecordingService: AudioRecordingService, private cd: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.abortRecording()
  }

  ngOnInit() {
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.audioURL = window.URL.createObjectURL(blob);
      console.log(blob);
      
      this.audioPlayer.nativeElement.src = this.audioURL;
      this.cd.detectChanges();
    });
    this.audioRecordingService.recordingTime$.subscribe(time => {
      this.recordedTime = time
    })    
    this.startRecording()
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
    this.audioStatusEvent.emit(true)
  }
  
  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
      this.audioStatusEvent.emit(false)
    }
  }

}
