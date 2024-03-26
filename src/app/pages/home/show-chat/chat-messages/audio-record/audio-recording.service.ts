import { Injectable } from '@angular/core';
import moment from 'moment';
import { Subject, interval } from 'rxjs';
import { bufferToWave } from './audio-helper';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {

  private chunks: any[] = [];
  private mediaRecorder: any;
  private audioContext: AudioContext = new AudioContext();
  private audioBlobSubject = new Subject<Blob>();
  private recordingTimeSubject = new Subject<string>();
  startTime:any
  interval:any

  audioBlob$ = this.audioBlobSubject.asObservable();
  recordingTime$ = this.recordingTimeSubject.asObservable();

  async startRecording() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (event: any) => this.chunks.push(event.data);
    this.recordingTimeSubject.next("00:00");
    this.mediaRecorder.start();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this.recordingTimeSubject.next(time);
      },
      500
    );
  }
    

  private toString(value:any) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  async stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.onstop = async () => {
        const audioData = await new Blob(this.chunks).arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
        this.audioBlobSubject.next(wavBlob);
        this.chunks = [];
      };
      this.mediaRecorder.stop();
    }
  }

  abortRecording() {
    this.stopMedia();
  }

  private stopMedia() {
    if (this.mediaRecorder) {
      this.mediaRecorder.onstop = async () => {
        clearInterval(this.interval);
        this.startTime = null;
        this.chunks = [];
      };
      this.mediaRecorder.stop();
      
    }
  }
  
}
