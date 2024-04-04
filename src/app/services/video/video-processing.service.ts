import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoProcessingService {

  constructor() { }

  generatePoster(videoUrl: string, timeOffset: number): Promise<string> {    
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;

      video.onloadedmetadata = () => {
        video.currentTime = timeOffset;
        video.width = 320;
        video.height = 240;

        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;

        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.width, video.height);

        const posterDataUrl = canvas.toDataURL('image/jpeg');
        resolve(posterDataUrl);
      };

      video.onerror = (error) => {
        reject(error);
      };
    });
  }
}